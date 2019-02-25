var year;

const leadColor = 'purple'
const memberColor = 'orange'

$(document).ready(() => {
    year = 'all'

    $.ajax({
        // eslint-disable-next-line
        url: API_BASE_URL + SPREADSHEET_ID + API_OPTIONS + API_KEY,
        type: 'GET'
    }).then(function(res) {
        console.log(res)

        res.values.forEach(row => {
            var group = rowToGroup(row)
            console.log(group)
            groups.push(group)
        })

        var graph = createGraph(groups, year)
        updateGraph(graph)    
    })


    $('#year-selector').change(function() {
        year = $(this).val()
        var graph = createGraph(groups, year)
        updateGraph(graph)
    });
});

function updateGraph(graph) {
    graph.nodes = colorNodes(graph.nodes)
    graph.edges = colorEdges(graph.edges)

    console.log(graph)

    var data = {}
    data.nodes = new vis.DataSet(graph.nodes)
    data.edges = new vis.DataSet(graph.edges)

    var container = document.getElementById('mynetwork');
    var options = {
        nodes: {
        font: {
            size: 16,
            face: 'helvetica'
        }
        },
        edges:{
        color: {
            inherit: false,
        },
        width: 3
        }
    };

    new vis.Network(container, data, options);
}

function colorEdges(edges) {
    edges.forEach(edge => {
        if (edge.tag === 'lead') {
        edge.color = {
            color: leadColor
        };
        edge.width = 5;
        }
        else if (edge.tag === 'member') {
        edge.color = {
            color: memberColor
        };
        edge.width = 2;
        }
    });

    return edges;
}

function colorNodes(nodes) {
    nodes.forEach(node => {
        if (node.tag === 'group') {
        node.font = {};
        node.font.size = 24;

        node.color = {};
        node.color.background = '#8ed1b4';
        node.color.border = '#25db8c';
        }
    });

    return nodes;
}