const currentSort = {column: 'name', ascending: true};	//desc
const columnIndeces = {
	name: 0,
	status: 1,
	availability: 2,
	power: 3,
	tons: 4,
	efficiency: 5,
	details: 6
};

const dataSort = column => {
	if (currentSort.column === column) {
		currentSort.ascending = !currentSort.ascending
	} else {
		currentSort.column = column;
		currentSort.ascending = true;
	}
	sortableTableData = sortableTableData.sort((a, b) => {
		if (currentSort.ascending) {
			const toReturn = a[columnIndeces[column]].value > b[columnIndeces[column]].value ? 1 : -1;
			return toReturn;
		} else {
			const toReturn = b[columnIndeces[column]].value > a[columnIndeces[column]].value ? 1 : -1;
			return toReturn;
		}
	});
	drawTbody();
};


let sortableTableData = [
	[
		{column: 'name', value: 'Chiller 1'},
		{column: 'status', value: 'Running'},
		{column: 'availability', value: 'Available'},
		{column: 'power', value: '0 kW'},
		{column: 'tons', value: '0 tR'},
		{column: 'efficiency', value: '0.000 kW/tR'},
		{column: 'details', value: 'Chill1Details'}
	],
	[
		{column: 'name', value: 'Chiller 2'},
		{column: 'status', value: 'Running'},
		{column: 'availability', value: 'Available'},
		{column: 'power', value: '0 kW'},
		{column: 'tons', value: '0 tR'},
		{column: 'efficiency', value: '0.000 kW/tR'},
		{column: 'details', value: 'Chill2Details'}
	],
	[
		{column: 'name', value: 'Chiller 3'},
		{column: 'status', value: 'Off'},
		{column: 'availability', value: 'Unavailable'},
		{column: 'power', value: '0 kW'},
		{column: 'tons', value: '0 tR'},
		{column: 'efficiency', value: '0.000 kW/tR'},
		{column: 'details', value: 'Chill3Details'}
	]
];



const width = 800;
const colWidth = (width / 6) - 1;
const rowHeight = '25px'
const openRowHeight = 140

const outerDiv = d3.select('#outer');

const table = outerDiv.append('table')
	.style('background-color', 'white')
	.style('width', width + 20 + 'px')
	.style('border-collapse', 'collapse')
	.style('text-align', 'left')
	.style('cursor', 'default')

const thead = table.append('thead')
	.style('display', 'block')
	.style('width', width + 'px')
const tbody = table.append('tbody')
	.style('display', 'block')
	.style('max-height', '200px')
	.style('overflow-y', 'auto')	//or scroll	
	.style('width', width + 'px')
	.property('data-simplebar', true)

//thead
const headerRow = thead.append('tr').style('border-bottom', '2px solid black')
	const th1 = headerRow.append('th')
		.html('Name')
		.style('width', colWidth + 'px')
		.attr('class', 'header nameHeader')
		.on('click', function(){
			dataSort('name');
		})
	const th2 = headerRow.append('th')
		.html('Status')
		.style('width', colWidth + 'px')
		.attr('class', 'header statusHeader')
		.on('click', function(){
			dataSort('status');
		})
	const th3 = headerRow.append('th')
		.html('Availability')
		.style('width', colWidth + 'px')
		.attr('class', 'header availabilityHeader')
		.on('click', function(){
			dataSort('availability');
		})
	const th4 = headerRow.append('th')
		.html('Power')
		.style('width', colWidth + 'px')
		.attr('class', 'header powerHeader')
		.on('click', function(){
			dataSort('power');
		})
	const th5 = headerRow.append('th')
		.html('Tons')
		.style('width', colWidth + 'px')
		.attr('class', 'header tonsHeader')
		.on('click', function(){
			dataSort('tons');
		})
	const th6 = headerRow.append('th')
		.html('Efficiency')
		.style('width', colWidth + 'px')
		.attr('class', 'header efficiencyHeader')
		.on('click', function(){
			dataSort('efficiency');
		})


//tbody
drawTbody();
function drawTbody() {
	if (!tbody.empty()) tbody.selectAll('*').remove();

	const rows = tbody.selectAll('.row')
		.data(sortableTableData)
		.enter().append('tr')
			.attr('class', 'row')
			.style('background-color', (d, i) => i%2 ? 'rgb(239, 240, 242)' : 'white')
			.attr('data-index', (d, i) => i)
	
	const cells = rows.selectAll('.cell')
		.data(d => d.filter(obj => obj.column !== 'details') )
		.enter().append('td')
			.attr('class', function(d) {return `cell ${d.column}Cell row${this.parentNode.getAttribute('data-index')}Cell`}) 
			.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
			.style('width', colWidth + 'px')
			.style('height', rowHeight)
			.style('vertical-align', 'top')
			.html(d => d.value)
			.style('overflow', 'hidden')

	const svgs = rows.append('svg')
		.attr('class', function(d) {return `svg ${d.column}Svg row${this.parentNode.getAttribute('data-index')}Svg`})
		.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
		.style('width', width + 'px')
		.style('height', rowHeight)
		.style('margin-left', `-${width}px`)
		.on('click', function() {
			const currentHeight = d3.select(this).style('height')
			const rowIndex = +this.parentNode.getAttribute('data-index');
			const thisRowCells = d3.selectAll(`.row${rowIndex}Cell,.row${rowIndex}Svg`)
			thisRowCells.style('height', currentHeight === rowHeight ? openRowHeight + 'px' : rowHeight);
		})


	svgs.append('rect')
		.attr('height', 10)
		.attr('x', 15)
		.attr('y', 60)
		.attr('width', width - 30)
		.attr('fill', 'pink')

	svgs.append('text')
		.text(function() {
					const detailsColumnIndex = columnIndeces.details;
					const rowIndex = this.parentNode.getAttribute('data-index');
					const chillerObject = sortableTableData[rowIndex];
					const chillerDetails = chillerObject[detailsColumnIndex].value;
					return chillerDetails;
				})
		.attr('y', openRowHeight / 1.5 + 'px')
		.attr('x', width / 2)


	// const svgs = cells.append('svg')
	// 	.attr('class', function(d) {return `svg ${d.column}Svg row${this.parentNode.getAttribute('data-index')}Svg`})
	// 	.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
	// 	.style('width', colWidth + 'px')
	// 	.style('height', rowHeight)

	// const columnValueTexts = svgs.append('text')
	// 	.text(d => d.value)
	// 	.attr('y', rowHeight)

	// const extraDetailsTexts = svgs.append('text')
	// 	.text(function() {
	// 		const detailsColumnIndex = columnIndeces.details;
	// 		const rowIndex = this.parentNode.getAttribute('data-index');
	// 		const chillerObject = sortableTableData[rowIndex];
	// 		const chillerDetails = chillerObject[detailsColumnIndex].value;
	// 		return chillerDetails;
	// 	})
	// 	.attr('y', openRowHeight + 'px')
}
