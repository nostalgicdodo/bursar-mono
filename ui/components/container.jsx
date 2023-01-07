
/*
 |
 | The idea for this component has been discarded
 |
 |
 */

export default function Container ( props ) {
	const containerAttributeKeys = Object.keys( props ).filter( p => attributes.has( p ) )
	if ( containerAttributeKeys.length === 0 )
		return <>
			{ props.children }
		</>

	const containerAttributes = containerAttributeKeys.reduce( ( k, o ) => {
		o[ k ] = props[ k ]
		return o
	}, { } )
	return <div { ...containerAttributes }>
		{ props.children }
	</div>
}

// Attributes that necessitate an opaque container
const attributes = new Set( [
	"style",
	"className",

	"class",
] )
