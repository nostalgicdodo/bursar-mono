
/**
 |
 | Async Task Queue Context
 |
 |
 | New Details:
 | - entity hierarchy — queues > queue > task > task controller
 | - a task is created and stored in a global cache? object;
 | 		this entry in the object lasts until all instances of the task (across the component tree) are unmounted.
 | 		To be clear, the entry is **not** removed when the task is completed.
 |
 |
 | Details:
 | - `cancel`-ing or un-`toggle`-ing a task
 | 		while it is in the `PROCESSING` state does nothing;
 | 		this is by design, so as to not give a
 | 		false impression to the user that it was cancelled,
 | 		as an HTTP request cannot be cancelled (on the server)
 | - persistUntilDone: think of the task context as a global-ish store/state
 | 		that holds an array of task entries.
 | 		The existence of these task entries in the array are typically bound
 | 		to a corresponding component (there can be multiple) in the component tree.
 | 		Meaning that if all the components that are associated with a task are unmounted,
 | 		then (and only then) the task entry is removed from the array.
 |
 |
 |
 */
/**-> to doi! */
// - option to subscribe to specific task status changes; for example, only `PROCESSING`

import type { ReactNode } from "react"

import { createContext, forwardRef, useContext, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react"

import type { Nullable, ObjectType, Simplify } from "@/utilities/typescript-types/common-types"

import splice from "@/utilities/lists/splice"
import removeFromList from "@/utilities/lists/remove-from-list"
import useRerender from "@/ui/react/hooks/useRerender"
import { isNotAnObject } from "@/utilities/type-checking/object"
import { isAPositiveIntegerNumber } from "@/utilities/type-checking/number/identity"
import { isAString, isBlankString, isNonBlankString, isStringBlank } from "@/utilities/type-checking/strings/identity"
import useLayoutEffect from "../hooks/useLayoutEffect"
import { isNotNullish, isNullish } from "@/utilities/type-checking/null-or-undefined"
import { isAFunction, isNotAFunction } from "@/utilities/type-checking/function"
import useOnUnmounting from "../hooks/useOnUnmounting"
import noOp, { noOpAsync } from "@/utilities/functions/no-op"
import { isArrayEmpty } from "@/utilities/type-checking/array"





const DEFAULT_QUEUE_ID = "default"

const TaskQueueContext = createContext<React.MutableRefObject<Nullable<TaskContext>>>( { current: null } )
TaskQueueContext.displayName = "TaskQueueContext"


type TaskQueueProviderProps = {
	children?: ReactNode;
}
function _TaskQueueProvider ( { children }: TaskQueueProviderProps, ref ) {
	const internalRef = useRef()

	let contextValue = useRef<Nullable<TaskContext>>()
	if ( isNullish( contextValue.current ) ) {
		contextValue.current = new TaskContext()
	}

	useImperativeHandle( ref ?? internalRef, function () {
		return contextValue.current
	} )


	return <TaskQueueContext.Provider value={ contextValue }>
		{ children }
	</TaskQueueContext.Provider>
}
export const TaskQueueProvider = forwardRef( _TaskQueueProvider )

export function useTaskQueueContext () {
	const context = useContext( TaskQueueContext )

	if ( ! ( context.current instanceof TaskContext ) ) {
		throw new Error( "`useTaskQueueContext` must be used within a TaskQueueProvider" )
	}
	return context.current
}




type TaskFnParameters = [
	done: () => void,
]
type TaskFn = ( ...[ done ]: TaskFnParameters ) => void
type AsyncTaskConf = Partial<{
	id: string;
	fn: TaskFn;
	deps: unknown[];
	queue: typeof DEFAULT_QUEUE_ID | string;
	maxProcessing: number;
	// Outcome event handlers
	onSuccess: ( ...args: any ) => void;
	onError: ( ...args: any ) => void;

	// scope: "LOCAL" | "GLOBAL";
	persistUntilDone: boolean;
}>
export function useAsyncTask ( options: AsyncTaskConf ) {
	const context = useTaskQueueContext()
	const internalTaskId = useId()
	const rerender = useRerender()

	let { id, queue: queueId, fn, maxProcessing, onSuccess, onError } = options ?? { }
	const taskId =  id || internalTaskId
	queueId = queueId || DEFAULT_QUEUE_ID

	maxProcessing = isAPositiveIntegerNumber( maxProcessing ) ? maxProcessing : 1
	const queue = context.addQueue( queueId, maxProcessing )

	let task = context.getTask( queueId, taskId )
	if ( ! task ) {
		task = context.addTask( queueId, taskId, new AsyncTask( taskId, queue, fn ) )
	}
	const asyncTaskController = TaskController.create( internalTaskId, task, rerender )
	asyncTaskController.setTaskFn( fn )
	asyncTaskController.on( "success", onSuccess )
	asyncTaskController.on( "error", onError )
	useEffect( function () {
		context.addTask( queueId, taskId, task )
			// ^ this logic is repeated here
		return () => {
			asyncTaskController.remove()
			context.removeTask( queueId, taskId )
		}
	}, [ taskId, queueId ] )

	return task
}


export function useTaskQueue ( id?: string ) {
	const context = useTaskQueueContext()
	id = isNonBlankString( id ) ? id : DEFAULT_QUEUE_ID

	context.addQueue( id )

	const rerender = useRerender()
	useEffect( function () {
		const unsubscribe = context.subscribe( id, rerender )
		return unsubscribe
	}, [ id ] )

	// return new TaskQueue( id )
	return { ...context.getQueue( id ) }
}


class TaskQueue {
	id: string
	waiting: AsyncTask[]
	processing: AsyncTask[]
	listeners: ( () => void )[]
	maxProcessing: number

	isTaskWaiting ( taskId: string, returnIndex = false ) {
		const indexOnWaitingQueue = this.waiting.findIndex( t => t.id === taskId )
		if ( returnIndex ) {
			return indexOnWaitingQueue
		}
		return indexOnWaitingQueue !== -1
	}
	isTaskProcessing ( taskId: string, returnIndex = false ) {
		const indexOnProcesingQueue = this.processing.findIndex( t => t.id === taskId )
		if ( returnIndex ) {
			return indexOnProcesingQueue
		}
		return indexOnProcesingQueue !== -1
	}

	removeTaskFromWaitingQueue ( taskId: string ) {
		this.waiting = removeFromList( this.waiting, t => t.id === taskId )
	}
	removeTaskFromProcessingQueue ( taskId: string ) {
		this.processing = removeFromList( this.processing, t => t.id === taskId )
	}
	moveTaskToWaitingQueue ( task: AsyncTask ) {
		if ( this.isTaskWaiting( task.id ) ) {
			return
		}
		this.waiting = this.waiting.concat( task )
	}
	moveTaskToProcessingQueue ( task: AsyncTask ) {
		if ( this.isTaskProcessing( task.id ) ) {
			return
		}
		this.removeTaskFromWaitingQueue( task.id )
		this.processing = this.processing.concat( task )
	}

	isAtMaxProcessingCapacity () {
		return this.processing.length >= this.maxProcessing
		// ^ there are scenarios where it can end up being greater
		// 	than the `maxProcessing` value, hence the `>=` comparator
	}

	// queueUpNextTaskForProcessing () {
	// 	const task = this.waiting[ 0 ]
	// 	if ( ! task ) {
	// 		return
	// 	}
	// 	task.moveToProcessingQueue()
	// 	return task
	// }

	getNextTaskInLineForProcessing () {
		const task = this.waiting[ 0 ]
		if ( ! task ) {
			return
		}
		return task
	}

	addListener ( fn: () => void ) {
		this.listeners = this.listeners.concat( fn )
	}

	// pullNextTaskFromWaitingQueue () {
	// 	const nextTask = this.waiting[ 0 ]
	// 	if ( ! nextTask ) {
	// 		return
	// 	}
	// 	this.waiting = this.waiting.slice( 1 )
	// 	// ^ remove the task from the waiting list
	// 	this.processing = this.processing.concat( nextTask )
	// }

	constructor ( id: string, maxProcessing: number = 1 ) {
		this.id = id
		this.waiting = [ ]
		this.processing = [ ]
		this.listeners = [ ]
		this.maxProcessing = maxProcessing
	}
}



/*
 |
 | Helpers
 |
 |
 */
class TaskContext {
	public queues: Record<string, TaskQueue>
	public tasks: Record<string, AsyncTask>

	subscribe ( id: string, fn: () => void ) {
		const queue = this.queues[ id ]!
		queue.addListener( fn )

		return () => {
			queue.listeners = removeFromList( queue.listeners, listener => listener === fn )
		}
	}
	getQueue ( id: string ) {
		return this.queues[ id ]
	}
	addQueue ( id: string, maxProcessing: number = 1 ) {
		if ( ! isNonBlankString( id ) ) {
			return
		}
		if ( ! this.queues[ id ] ) {
			this.queues[ id ] = new TaskQueue( id, maxProcessing )
		}
		return this.queues[ id ]!
	}

	getFullyQualifiedTaskId ( queueId: string, taskId: string ) {
		return `${ queueId }/${ taskId }`
	}
	getTask ( queueId: string, taskId: string ) {
		return this.tasks[ this.getFullyQualifiedTaskId( queueId, taskId ) ]
	}
	addTask ( queueId: string, taskId: string, newTask: AsyncTask ) {
		const existingTask = this.getTask( queueId, taskId )
		if ( ! existingTask ) {
			this.tasks[ this.getFullyQualifiedTaskId( queueId, taskId ) ] = newTask
		}

		return existingTask || newTask
	}
	replaceTask ( queueId: string, taskId: string, newTask: AsyncTask ) {
		this.tasks[ this.getFullyQualifiedTaskId( queueId, taskId ) ] = newTask
		return newTask
	}
	removeTask ( queueId: string, taskId: string ) {
		delete this.tasks[ this.getFullyQualifiedTaskId( queueId, taskId ) ]
	}

	constructor () {
		this.queues = { }
		this.tasks = { }
	}
}

function createContextState () {
	const queues = { }
	const allTasks = { }
		// ^ all tasks across all queues

	function subscribe ( id: string, fn: () => void ) {
		const queue = queues[ id ]
		queue.listeners = queue.listeners.concat( fn )

		return () => {
			const indexOfListener = queue.listeners.indexOf( fn )
			queue.listeners = splice( queue.listeners, indexOfListener )
		}
	}

	return {
		queues,
		subscribe,
		allTasks,
	}
}

class AsyncTask {
	private id: string

	private controllerIds: TaskController[ "id" ][]
	private controllers: Record<string, TaskController>
	registerController ( id: string, controller: TaskController ) {
		if ( ! this.controllers[ id ] ) {
			this.controllers[ id ] = controller
		}
		// if ( ! this.controllerIds.includes( id ) ) {
		// 	this.controllerIds = this.controllerIds.concat( id )
		// }
		// if ( !( this.controllers[ id ] instanceof TaskController ) ) {
		// 	this.controllers[ id ] = controller
		// }
	}
	unregisterController ( id: string ) {
		// this.controllerIds = removeFromList( this.controllerIds, e => e === id )
		delete this.controllers[ id ]
		// If there are no more controllers, then remove the task as well
		// if ( isArrayEmpty( this.controllerIds ) ) {
		if ( isArrayEmpty( Object.keys( this.controllers ) ) ) {
			this.remove()
		}
	}

	/**
	 | Statuses
	 |
	 */
	private _processingStatus: "IDLE" | "QUEUED" | "PROCESSING"
	get processingStatus () {
		return this._processingStatus
	}
		markAsIdle () {
			this._processingStatus = "IDLE"
		}
		markAsQueued () {
			this._processingStatus = "QUEUED"
		}
		markAsProcessing () {
			this._processingStatus = "PROCESSING"
		}

	private _resultStatus: null | "SUCCESSFUL" | "FAILED"
	get resultStatus () {
		return this._resultStatus
	}
		markAsSuccessful () {
			this._resultStatus = "SUCCESSFUL"
		}
		markAsFailed () {
			this._resultStatus = "FAILED"
		}
	private _previousResultStatus: null | "SUCCESSFUL" | "FAILED"
	get previousResultStatus () {
		return this._previousResultStatus
	}
	set previousResultStatus ( status ) {
		this._previousResultStatus = status
	}

	/**
	 | Queue
	 |
	 */
	private queue: TaskQueue
	isWaiting ( returnIndex = false ) {
		return this.queue.isTaskWaiting( this.id, returnIndex )
	}
	isProcessing ( returnIndex = false ) {
		return this.queue.isTaskProcessing( this.id, returnIndex )
	}
	isEnqueued () {
		return this.isWaiting() || this.isProcessing()
	}
	removeFromWaitingQueue () {
		this.queue.removeTaskFromWaitingQueue( this.id )
		this.markAsIdle()
	}
	removeFromProcessingQueue ( taskId: string = this.id ) {
		this.queue.removeTaskFromProcessingQueue( taskId )
		this.markAsIdle()
	}
	moveToWaitingQueue () {
		this.queue.moveTaskToWaitingQueue( this )
		this.markAsQueued()
	}
	moveToProcessingQueue () {
		this.queue.moveTaskToProcessingQueue( this )
		this.removeFromWaitingQueue()
		this.markAsProcessing()
	}


	// UNUSED: REMOVE THIS
	rerenderAllInstances () {
		for ( let id in this.controllers ) {
			this.controllers[ id ].rerender()
		}
	}
	broadcastStateChange () {
		// Broadcast to the other controllers of the task
		for ( let id in this.controllers ) {
			this.controllers[ id ].rerender()
		}
		// Broadcast to the associated queue's subscribers
		this.queue.listeners.forEach( fn => fn() )
	}

	private taskFn: ( ...args: any[] ) => void
	setFn ( fn: AsyncTask[ "taskFn" ] ) {
		this.taskFn = fn
	}
	fn ( ...args: any[] ) {
		this.markAsProcessing()
		this.broadcastStateChange()
		return this.taskFn( ...args )
	}
	private taskFnArgs: any[]
	setArgs ( args: any[] ) {
		this.taskFnArgs = args
	}
	performFn () {
		this.fn(
			( outcome = true, ...args: any[] ) => this.onDone( outcome, ...args ),
				// ^ this needs to be an arrow function, so that `this` is bound to the task instance
			this.id,
			...this.taskFnArgs
		)
	}

	unregisterOutcomeHandlers () {
		for ( let id in this.controllers ) {
			this.controllers[ id ].off()
		}
	}


	/**
	 | Task Processing
	 |
	 */
	run ( ...args: any[] ) {
		if ( this.isProcessing() ) {
			// ^ If task is already being processed,
			// 	no need to queue another instance.
			// 	Also, the UI should prevent cancelling a task that is already being processed.
			return

		}
		if ( this.isWaiting() ) {
			// ^ If task is already in the waiting queue, do nothing
			return
		}

		this.setArgs( args )
		this.moveToWaitingQueue()
		this.broadcastStateChange()

		this.processNextTask()
	}
	cancel () {
		if ( this.isProcessing() ) {
			// ^ If task is already being processed, do nothing
			// 	(it could be removed from the processing list to make way for the next task but the damage is already done)
			return
		}
		if ( this.isWaiting() ) {
			// ^ If task is in the queue, then remove it
			this.removeFromWaitingQueue()
			this.broadcastStateChange()
		}
	}
	toggle ( ...args: any[] ) {
		if ( this.isProcessing() ) {
			// ^ If task is already being processed, do nothing
			// 	(it could be removed from the processing list to make way for the next task but the damage is already done)
			return
		}

		if ( this.isWaiting() ) {
			// ^ If task is in the waiting queue, then remove it
			this.removeFromWaitingQueue()
			this.broadcastStateChange()
			return
		}

		// Else if task is just idle, then add it to the waiting queue
		this.setArgs( args )
		this.moveToWaitingQueue()
		this.broadcastStateChange()

		this.processNextTask()
	}
	processNextTask ( idOfTaskToDequeue?: string ) {
		if ( idOfTaskToDequeue ) {
			// This function is invoked when a task invokes the `done` callback,
			// 	indicating that the task has completed.
			// 	Hence, the task should be removed from the processing list.
			this.removeFromProcessingQueue( idOfTaskToDequeue )
			this.broadcastStateChange()

			// TODO
			// task.cleanupInstancesOutOfScope()
		}

		if ( this.queue.isAtMaxProcessingCapacity() ) {
			return
		}

		/**
		 | Pull the next task from the waiting list (if there is one)
		 | 	and move it to the processing list.
		 |
		 */
		// const nextTask = this.queue.queueUpNextTaskForProcessing()
		const nextTask = this.queue.getNextTaskInLineForProcessing()
		if ( ! nextTask ) {
			return
		}

		// this.broadcastStateChange()
		nextTask.moveToProcessingQueue()
		nextTask.broadcastStateChange()
		nextTask.performFn()
	}
	onDone ( outcome: boolean, ...args: any[] ) {
		if ( outcome ) {
			this.markAsSuccessful()
		}
		else {
			this.markAsFailed()
		}

		// Run all the outcome event handlers
		if ( isNotNullish( outcome ) ) {
			for ( let id in this.controllers ) {
				this.controllers[ id ]!.runOutcomeHandler( outcome, ...args )
			}
		}

		// this.broadcastStateChange()
		return this.processNextTask( this.id )
	}






	/**
	 | Task instantiation
	 |
	 */
	// static create ( { id, queue, rerender } ) {
	// 	return new AsyncTask( id, queue )
	// }
	// static _create ( { _id, id, queue, fn, rerender, context } ) {
	// 	let task = context.allTasks[ id ]
	// 	if ( ! task ) {
	// 		task = new AsyncTask( _id, id, queue, fn )
	// 		context.allTasks[ id ] = task
	// 	}
	// 	return TaskController.create( _id, task, rerender )
	// }

	constructor ( id: string, queue: TaskQueue ) {
		this.id = id
		this.queue = queue
		this._processingStatus = "IDLE"
		this._resultStatus = null
		this._previousResultStatus = null
		this.taskFn = noOpAsync
		this.controllerIds = [ ]
		this.controllers = { }
		this.taskFnArgs = [ ]
		// this.instancesOutOfScope = [ ]

		// `this` resolution patching for public-facing methods
		// this.run = this.run.bind( this )
		// this.cancel = this.cancel.bind( this )
		// this.toggle = this.toggle.bind( this )
	}

	remove () {
		this.cancel()
		for ( let instanceId in this.controllers ) {
			this.controllers[ instanceId ]!.remove()
		}
		//
	}
}

class TaskController {
	private id: string
	private task: AsyncTask

	rerender: () => void

	setTaskFn ( fn?: AsyncTask[ "fn" ] ) {
		if ( isNotAFunction( fn ) ) {
			return
		}
		this.task.setFn( fn )
	}

	private onSuccess: ( ...args: any[] ) => void
	private onError: ( ...args: any[] ) => void
	on ( event: "success" | "error", handler?: typeof this.onSuccess ) {
		if ( isNotAFunction( handler ) ) {
			return
		}

		if ( event === "success" ) {
			this.onSuccess = handler
		}
		else if ( event === "error" ) {
			this.onError = handler
		}
	}
	off ( event?: "success" | "error" ) {
		if ( event === "success" ) {
			this.onSuccess = noOp
		}
		else if ( event === "error" ) {
			this.onError = noOp
		}
		else {
			this.onSuccess = noOp
			this.onError = noOp
		}
	}
	runOutcomeHandler ( outcome: boolean, ...args: any[] ) {
		if ( outcome ) {
			this.onSuccess( ...args )
		}
		else {
			this.onError( ...args )
		}
	}

	static create ( id: string, task: AsyncTask, rerender: () => void ) {
		const taskController = new TaskController( id, task, rerender )
		task.registerController( id, taskController )
		return taskController
	}

	constructor ( id: string, task: AsyncTask, rerender: () => void ) {
		this.id = id
		this.task = task
		this.rerender = rerender
		this.onSuccess = noOp
		this.onError = noOp
	}

	remove () {
		// this.off()
		this.task.unregisterController( this.id )
	}
}
