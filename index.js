const width = 960;
const height = 500;

const t = d3.transition().duration(1000);

function showTooltip(element, data) {
    console.log(data)
}

//Create SVG element and append map to the SVG
const svg = d3.select(".wrapper")
    .append("svg")
    .attr('viewBox', '0 0 960 500')
    .attr("width", '100%')
    .attr("height", '100%');

// Append Div for tooltip to SVG
const div = d3.select(".wrapper")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function createMap(data) {
    const {states, events,} = data;

    // D3 Projection
    const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])    // translate to center of screen
        .scale([1000]);          // scale things down so see entire US

// Define path generator
    const path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
        .projection(projection);

    // Define linear scale for output
    const colors = ["#ccc", "red",];

    const colorScale = d3.scaleLinear()
        .domain([0, 10])
        .range(colors);


    const legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];
//       console.log(data)


    let us = svg.selectAll("path")
        .data(states, d => d.id);

    us.exit().remove();

    const usEnter = us
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style('fill', '#ccc');

    usEnter.merge(us)
        .transition(t)
        .style('fill', d => colorScale(d.properties.events));


    let circles = svg.selectAll("circle")
        .data(events, d => d.properties.CaseID);

    circles.exit()
        .transition(t)
        .attr('r', 0)
        .remove();

    const circlesEnter = circles
        .enter()
        .append("circle")
        .attr('r', 0)
        .attr("cx", function (d) {
            const [lon, lat,] = d.geometry.coordinates;
            return projection([lon, lat])[0];
        })
        .attr("cy", function (d) {
            const [lon, lat,] = d.geometry.coordinates;
            return projection([lon, lat])[1];
        })
        .style("fill", "rgb(217,91,67)")
        .style("opacity", 0.85)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.text(d.properties.Description)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            div.call(function () {
                return showTooltip(div.node(), d.properties)
            })
        })
        // fade out tooltip on mouse out
        .on("mouseout", function () {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    circlesEnter.merge(circles)
        .transition(t)
        .attr('r', 10);

    let locations = svg.append('g').selectAll("path")
        .data(events, d => d.properties.CaseID);

    locations.exit()
        .transition(t)
        .attr('r', 0)
        .remove();

    const locationsEnter = locations
        .enter()
        .append("path")
        .attr('d', 'M455.043,222.521h-46.982c-5.016-89.007-76.533-160.524-165.54-165.54V10c0-5.523-4.478-10-10-10s-10,4.477-10,10v46.982  c-89.007,5.016-160.525,76.533-165.541,165.54H10c-5.522,0-10,4.477-10,10s4.478,10,10,10h46.981  c5.016,89.007,76.533,160.525,165.541,165.54v46.981c0,5.523,4.478,10,10,10s10-4.477,10-10v-46.981  c89.007-5.016,160.524-76.533,165.54-165.54h46.982c5.522,0,10-4.477,10-10S460.565,222.521,455.043,222.521z M388.022,222.521  h-37.765c-4.816-57.194-50.541-102.92-107.735-107.736V77.021C320.496,81.984,383.058,144.547,388.022,222.521z M222.521,242.521  v29.244c-14.309-3.648-25.596-14.935-29.244-29.244H222.521z M193.277,222.521c3.648-14.309,14.935-25.596,29.244-29.244v29.244  H193.277z M242.521,242.521h29.243c-3.648,14.309-14.935,25.595-29.243,29.244V242.521z M242.521,222.521v-29.244  c14.309,3.648,25.595,14.935,29.243,29.244H242.521z M222.521,172.867c-25.358,4.238-45.417,24.296-49.655,49.654h-38.004  c4.691-46.16,41.498-82.966,87.658-87.657V172.867z M172.867,242.521c4.238,25.358,24.296,45.416,49.655,49.654v38.003  c-46.16-4.692-82.967-41.498-87.658-87.657H172.867z M242.521,292.176c25.358-4.238,45.416-24.296,49.654-49.654h38.002  c-4.691,46.159-41.497,82.966-87.656,87.657V292.176z M292.175,222.521c-4.238-25.358-24.296-45.416-49.654-49.654v-38.003  c46.159,4.692,82.965,41.498,87.656,87.657H292.175z M222.521,77.021v37.765c-57.195,4.816-102.92,50.541-107.737,107.736H77.02  C81.984,144.547,144.547,81.984,222.521,77.021z M77.02,242.521h37.764c4.816,57.194,50.542,102.92,107.737,107.736v37.765  C144.547,383.059,81.984,320.496,77.02,242.521z M242.521,388.023v-37.765c57.194-4.816,102.919-50.542,107.735-107.736h37.765  C383.058,320.496,320.496,383.059,242.521,388.023z')
        .attr('transform', d => {
            const [lon, lat,] = d.geometry.coordinates;
            const [x, y,] = projection([lon, lat]);
            return `translate(${x}, ${y}) scale(0)`
        })
        .style("fill", "#111")
        .style('stroke', '#000')
        .style('stroke-width', '3')
        .style("opacity", 0.85);

    locationsEnter.merge(locations)
        .transition(t)
        .attr('transform', d => {
            const [lon, lat,] = d.geometry.coordinates;
            const [x, y,] = projection([lon, lat]);
            return `translate(${x}, ${y}) scale(0.1)`
        })
}

function createMapController(data) {
    const selectWrapper = document.querySelector('.wrapper > .select');
    const years = Object.keys(data);
    const select = document.createElement('select');
    years.forEach(year => {
        const option = document.createElement('option');
        option.setAttribute('value', year);
        option.innerText = year;
        select.appendChild(option)
    });
    select.addEventListener('change', e => {
        addTotalEvents(data[e.target.value])
    });
    selectWrapper.appendChild(select)
}

function addTotalEvents(events) {
    const totals = {};
    events.forEach(event => {
        const state = event.properties.State;
        if (!totals[state]) {
            totals[state] = 1
        } else {
            totals[state] = totals[state] + 1
        }
    });

    d3.json('us.json', function (error, us) {
        const states = us.features.map(state => {
            state.properties.events = totals[state.properties.name] || 0;

            return state
        });
        createMap({states, events,})
    })
}

d3.json("statistics.json", function (error, data) {
    const bakedData = data.features.reduce(function (results, event) {
        const year = event.properties.Date.split('/')[2];
        if (!results[year]) {
            results[year] = []
        }
        results[year].push(event);

        return results;
    }, {});
    createMapController(bakedData);
    addTotalEvents(bakedData[Object.keys(bakedData)[0]])
});
