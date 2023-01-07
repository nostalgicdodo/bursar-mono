
/*
 |
 | Simply render a (pre-filled) form and then auto-submit it.
 | The purpose is to facilitate (mostly **non-GET**) HTTP redirects from the _front-end_.
 |
 |
 */

export function FormNavigate ( { url, method, body } ) {
	const domRef = React.useRef( null )
	const styles = {
		position: "absolute",
		margin: "-1px",
		width: "1px",
		height: "1px",
		border: "none",
		padding: 0,
		clip: "rect(0 0 0 0)",
		overflow: "hidden",
	}

	React.useEffect( function () {
		domRef.current.submit()
	}, [ ] )

	return <form ref={domRef} method={method} encType="multipart/form-data" action={url} styles={styles}>
		{ body.map( ([ k, v ], i) => <textarea key={i} name={k} defaultValue={v} /> ) }
	</form>
}
