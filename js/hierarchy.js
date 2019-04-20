const LeadOffset = 1;
const MaxGBLeads = 2;

const MemberOffset = 4;
const MaxGBMembers = 6;

const YearRowLength = 2;

// Color Gradient Generator: https://codepen.io/BangEqual/pen/VLNowO
let colors = [
  "#7d1b0d",
  "#7a351a",
  "#765026",
  "#736a33",
  "#708540",
  "#6d9f4d",
  "#69ba59"
];

// createNodes takes the rows of the Google Spreadsheet and returns a list of nodes
// that can be used with the visjs network.
// returns: [
//     { id: "Robert Zalog", label: "Robert Zalog", level: 0},
//     ...
// ]
function createNodes(rows) {
  nonEmptyRows = rows.filter(row => row.length > 0);

  let levelCounter = 0; // keeps track of what level each personn should be on
  let people = {}; // maps names of people to what level they should be on

  for (let row of nonEmptyRows) {
    if (row.length <= YearRowLength) {
      // If we hit a year row, increment level counter
      levelCounter += 1;
    } else {
      // If we hit a GB row, insert everyone in that row into the map

      // Insert GB Leads
      for (let k = 0; k < MaxGBLeads; k++) {
        leadName = row[LeadOffset + k];
        if (leadName != "" && people[leadName] == undefined) {
          people[leadName] = levelCounter;
        }
      }

      // Insert GB Members
      for (let k = 0; k < MaxGBMembers && MemberOffset + k < row.length; k++) {
        memberName = row[MemberOffset + k];
        if (memberName != "" && people[memberName] == undefined) {
          people[memberName] = levelCounter + 1;
        }
      }
    }
  }

  // Format everyone into a node and push them into a list
  nodeList = [];
  for (let key in people) {
    nodeList.push({
      id: key,
      label: key,
      level: people[key],
      color: {
        background: colors[people[key]]
      }
    });
  }

  // Inject number of nodes into statistics HTML
  $("#num-students").html(nodeList.length)

  return nodeList;
}

// createEdges takes the rows of the Google Spreadsheet and returns a list of edges
// that can be used with the visjs network.
// returns: [
//     { from: "Robert Zalog", to: "Roselyn Lee" },
//     ...
// ]
function createEdges(rows) {
  // Filter out rows that are not GB rows
  gbRows = rows.filter(row => row.length > YearRowLength);

  let edgeList = [];

  for (let row of gbRows) {
    for (let j = 0; j < MaxGBLeads; j++) {
      for (let k = 0; k < MaxGBMembers && MemberOffset + k < row.length; k++) {
        leadName = row[LeadOffset + j];
        memberName = row[MemberOffset + k];

        if (leadName != "" && memberName != "") {
          edgeList.push({ from: leadName, to: memberName });
        }
      }
    }
  }

  return edgeList;
}

$.ajax({
  url: API_BASE_URL + SPREADSHEET_ID + API_OPTIONS + API_KEY,
  type: "GET"
}).then(function(res) {
  let nodeList = createNodes(res.values);
  let edgeList = createEdges(res.values);

  var nodes = new vis.DataSet(nodeList);
  var edges = new vis.DataSet(edgeList);

  var container = document.getElementById("hierarchical-network");

  var data = {
    nodes: nodes,
    edges: edges
  };

  var options = {
    physics: { enabled: false },
    interaction: { dragNodes: false },
    clickToUse: true,
    edges: {
      color: {
        color: "#00629b"
      }
    },
    layout: {
      hierarchical: {
        enabled: true,
        levelSeparation: 300,
        nodeSpacing: 150,
        treeSpacing: 0
      }
    }
  };

  var network = new vis.Network(container, data, options);

  // Listens to the input element and tries to focus on a specific node
  $("input").keyup(function(e) {
    let name = e.target.value;

    focusOptions = {
      scale: 1.0,
      animation: {
        duration: 1000,
        easingFunction: "easeInOutQuad"
      }
    };

    matchingNodes = nodeList.filter(p => p.label == name)
    if (matchingNodes.length > 0) {
        network.focus(name, focusOptions);
    }
  });
});
