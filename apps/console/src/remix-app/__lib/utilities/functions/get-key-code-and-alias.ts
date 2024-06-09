
export default function getKeyCodeAndAlias ( event ): { keyAlias: string; keyCode: number } {
	return {
		keyAlias: ( event.key || String.fromCharCode( event.which ) ).toLowerCase(),
		keyCode: parseInt( event.which || event.keyCode ),
	}
}
