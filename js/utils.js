export const Authentication_url = "https://learn.zone01dakar.sn/api/auth/signin"

export const graphql_url = "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql"

export async function fetchData(test) {
    try {
        const response = await fetch(Authentication_url, {
            method: 'POST', // Specify the method
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${test}` // Ensure 'test' variable contains your base64 encoded credentials
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        if (data){
            return data;
        }
    } catch (error) {

    }
}

export function showError(message) {
    const errorMessages = document.getElementById('error_messages');
    const errorElement = document.createElement('div');
    errorElement.style.color = 'red';
    errorElement.innerText = message;
    errorMessages.appendChild(errorElement);
}

export function formatByteSize(bytes) {
    const kilobyte = 1000;
    const megabyte = kilobyte * 1000;
    const gigabyte = megabyte * 1000;
  
    if (bytes >= gigabyte) {
      return (bytes / gigabyte).toFixed() + ' GB';
    } else if (bytes >= megabyte) {
      return (bytes / megabyte).toFixed() + ' MB';
    } else if (bytes >= kilobyte) {
      return (bytes / kilobyte).toFixed() + ' KB';
    } else {
      return bytes + ' Bytes';
    }
  }

  export function DisplayUpandDown(up, down) {
    // Set the dimensions and margins of the graph
    const width = 600;
    const height = 400;
    const margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one).
    const radius = Math.min(width, height) / 2 - margin;

    // Remove any existing SVG
    d3.select("#chart").select("svg").remove();

    // Append the svg object to the div called 'chart'
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Data
    const data = [
        { key: "Up", value: up },
        { key: "Down", value: down }
    ];

    // Set the color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.key))
        .range(["green", "red"]);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(d => d.value);
    const data_ready = pie(data);

    // Shape helper to build arcs:
    const arc = d3.arc()
        .innerRadius(radius * 0.5) // This is the size of the donut hole
        .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.key))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        // Add hover effects
        .on("mouseover", function(event, d) {
            // Show the value on hover
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1);
            // Position and display the value
            svg.append("text")
                .attr("class", "hover-value")
                .attr("text-anchor", "middle")
                .attr("dy", "-0.5em")
                .text(d.data.value)
                .attr("transform", `translate(${arc.centroid(d)})`)
                .style("pointer-events", "none");
        })
        .on("mouseout", function(event, d) {
            // Hide value on mouseout
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 0.7);
            // Remove the displayed value
            svg.select(".hover-value").remove();
        });

    // Add the polylines between chart and labels:
    svg.selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
            const posA = arc.centroid(d); // line insertion in the slice
            const posB = outerArc.centroid(d); // line break: we use the arc to have a line that is perfectly aligned with the slice
            const posC = outerArc.centroid(d); // Label position = almost the same as posB
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // Multiplying by radius to ensure labels are aligned with slices
            return [posA, posB, posC];
        });

    // Add the polylines labels:
    svg.selectAll('allLabels')
        .data(data_ready)
        .join('text')
        .text(d => d.data.key)
        .attr('transform', function (d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function (d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end');
        });
}

export function Encrypt(str){
    return btoa(unescape(encodeURIComponent(str)))
  }