function createGraph(groups, year) {
    var res = {}
    res.nodes = []
    res.edges = []

    var nodes = {}
    var counter = 0

    console.log(groups)

    groups.forEach(group => {
        if (year !== 'all' && group.year !== year) {
            console.log(group.year + ' did not match ' + year);
            return
        }
        
        if (!nodes[group.name]) {
            nodes[group.name] = counter
            counter++
            addNode(res.nodes, group.name, nodes[group.name], 'group')
        }

        var groupId = nodes[group.name]

        group.leads.forEach(lead => {
            if (!nodes[lead]) {
                nodes[lead] = counter
                counter++
                addNode(res.nodes, lead, nodes[lead])
            }

            addEdge(res.edges, groupId, nodes[lead], 'lead')
        })

        group.members.forEach(member => {
            if (!nodes[member]) {
                nodes[member] = counter
                counter++
                addNode(res.nodes, member, nodes[member])
            }

            addEdge(res.edges, groupId, nodes[member], 'member')
        })
    })

    return res
}

function addEdge(edges, from, to, tag) {
    edges.push({
        from: from,
        to: to,
        tag: tag
    })
}

function addNode(nodes, label, id, tag) {
    nodes.push({
        id: id,
        label: label,
        tag: tag
    })
}