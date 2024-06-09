
/**
 |
 | useAsyncTaskPipeline
 |
 | A hook to manage a queue of tasks (sync/async functions)
 | Returns APIs to:
 | - add task to queue
 | - remove task from queue
 | - access task queue
 | - access tasks in pipeline (i.e. being processed)
 |
 | A task comprises of:
 | - an id
 | - a payload
 | - a processing function (optional)
 |
 |
 */

import { useRef } from "react"

import type { ObjectType } from "@/utilities/typescript-types/common-types"

import splice from "@/utilities/lists/splice"
import removeFromList from "@/utilities/lists/remove-from-list"
import useRerender from "@/ui/react/hooks/useRerender"





export default function useAsyncTaskPipeline ( defaultTaskProcessingFn: Function ) {
	const rerender = useRerender()
	const tasksInQueue = useRef( [ ] )
	const tasksInPipeline = useRef( [ ] )

	function processNextTask ( idOfTaskToDequeue?: string ) {
		if ( idOfTaskToDequeue ) {
			tasksInPipeline.current = removeFromList( tasksInPipeline.current, t => t.id === idOfTaskToDequeue )
		}

		const nextTask = tasksInQueue.current[ 0 ]
		if ( ! nextTask ) {
			return
		}
		tasksInQueue.current = tasksInQueue.current.slice( 1 )
			// ^ remove the task from the queue
		tasksInPipeline.current = tasksInPipeline.current.concat( nextTask )

		const taskProcessingFn__resolved = nextTask.taskProcessingFn ?? defaultTaskProcessingFn
		rerender()
		taskProcessingFn__resolved( nextTask.id, nextTask.payload, () => processNextTask( nextTask.id ) )
	}

	function toggleTask ( id: string, payload: ObjectType, taskProcessingFn?: Function ) {
		const indexOnPipeline = tasksInPipeline.current.findIndex( t => t.id === id )
		if ( indexOnPipeline !== -1 ) {
			// ^ If task is already being processed, do nothing
			return
		}

		const indexOnQueue = tasksInQueue.current.findIndex( t => t.id === id )
		if ( indexOnQueue !== -1 ) {
			// ^ If task is in the queue, remove it from there
			tasksInQueue.current = splice( tasksInQueue.current, indexOnQueue )
			rerender()
			return
		}
		else {
			// Else, add task to the queue
			tasksInQueue.current = tasksInQueue.current.concat( { id, payload, taskProcessingFn } )
		}

		const taskPipelineIsAtCapacity = tasksInPipeline.current.length
		if ( taskPipelineIsAtCapacity ) {
			rerender()
			return
		}
		processNextTask()
	}

	return {
		queue: tasksInQueue.current,
		pipeline: tasksInPipeline.current,
		toggle: toggleTask,
	}
}
