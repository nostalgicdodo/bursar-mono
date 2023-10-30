
export default function Log ( { data, className = "" } ) {
	return <pre className={ className } style={{ whiteSpace: "pre-wrap" }}>
		{ JSON.stringify( data, null, "\t" ) }
	</pre>
}
