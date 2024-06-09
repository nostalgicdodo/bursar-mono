
/**
 |
 | Takes an array of objects with an `id` and `parentId` property,
 | 	and returns two hierarchical versions of it
 | 		(see commented out examples below)
 |
 |
 */
export default function restructureAsTreeList ( list ) {
	let treeObject = { }
	let flatTreeList = [ ]
	let hierarchicalTreeList = [ ]

	for ( const element of list ) {
		if ( element.id in treeObject ) {
			// ^ this would mean that a child of this object was approached earlier,
			// 	and hence a stub for the parent was created
			const children = treeObject[ element.id ].children
			treeObject[ element.id ] = element
			treeObject[ element.id ].children = children
		}
		else {
			treeObject[ element.id ] = element
			treeObject[ element.id ].children = [ ]
		}

		if ( element.parentId !== null ) {
			if ( element.parentId in treeObject ) {
				treeObject[ element.parentId ].children = treeObject[ element.parentId ].children.concat( treeObject[ element.id ] )
			}
			else {
				treeObject[ element.parentId ] = { children: [ treeObject[ element.id ] ] }
			}
		}
		else {
			hierarchicalTreeList.push( treeObject[ element.id ] )
		}

		flatTreeList.push( treeObject[ element.id ] )
	}

	return { flatTreeList, hierarchicalTreeList }
}


/**

const input = [
	{ id: 4, name: "A", parentId: 5 },
	{ id: 3, name: "H", parentId: 2 },
	{ id: 1, name: "R", parentId: null },
	{ id: 5, name: "A", parentId: 1 },
	{ id: 2, name: "Y", parentId: null }
]

const output = restructureAsTreeList( input )

// Output:
const output = {
	flatTreeList: [
		{ id: 4, name: 'A', parentId: 5, children: [ ] },
		{ id: 3, name: 'H', parentId: 2, children: [ ] },
		{ id: 1, name: 'R', parentId: null, children: [
			{ id: 5, name: 'A', parentId: 1, children: [
				{ id: 4, name: 'A', parentId: 5, children: [ ] },
			] }
		] },
		{ id: 5, name: 'A', parentId: 1, children: [
			{ id: 4, name: 'A', parentId: 5, children: [ ] },
		] },
		{ id: 2, name: 'Y', parentId: null, children: [
			{ id: 3, name: 'H', parentId: 2, children: [ ] },
		] }
	],
	hierarchicalTreeList: [
		{ id: 1, name: 'R', parentId: null, children: [
			{ id: 5, name: 'A', parentId: 1, children: [
				{ id: 4, name: 'A', parentId: 5, children: [ ] },
			] }
		] },
		{ id: 2, name: 'Y', parentId: null, children: [
			{ id: 3, name: 'H', parentId: 2, children: [ ] },
		] }
	]
}

 */
