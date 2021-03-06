groups = []

const SPREADSHEET_ID = '16GxwOgUyLDTbeukERrZKlAZV_JumFUJH53PTafrNcIo'
const API_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/'

const API_OPTIONS = '/values/Groups!A2:M1000?key='
// API_KEY provided in separate file secrets.js so that we don't have to push
// it to GitHub

function rowToGroup(row) {
    // Relies on the following column structure in the Google Sheet:
    // GB Name | Lead 1 | Lead 2 | Lead 3 | Year | Member 1 | Member 2 | ... | Member 8
    
    console.log('convert ' + row)

    if (!row[0] || !row[1] || !row[4] || !row[5]) {
        return null
    }

    var group = {}

    group.name = row[0]
    group.leads = [row[1]]
    if (row[2]) group.leads.push(row[2])
    if (row[3]) group.leads.push(row[3])
    group.year = parseInt(row[4])
    group.members = []
    for (var i=5; i < row.length; i++)
        group.members.push(row[i])

    return group
}