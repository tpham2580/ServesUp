const baseUrl = `http://flip2.engr.oregonstate.edu:5995/carts`;

var tableBody = document.getElementById("cartsTable");

const makeTable = (allRows) => {
    //clears the table
    tableBody.innerHTML = "";

    let header_row = document.createElement("tr");
    let cartID = document.createElement("th");
    let totalCost = document.createElement("th");
    let status = document.createElement("th");
    cartID.textContent = "Cart ID";
    totalCost.textContent = "Total Cost";
    status.textContent = "Active Cart";
    header_row.appendChild(cartID)
    header_row.appendChild(totalCost)
    header_row.appendChild(status)
    tableBody.appendChild(header_row)

    //Iterate through rows
    for (let row = 0; row < allRows.rows.length; row++){
        tableBody.appendChild(makeRow(allRows.rows[row]));
    };
};

const makeRow = (row) => {
    const data_members = ['cartID', 'totalCost', 'status'];

    let new_row = document.createElement("tr");
    new_row.setAttribute("id", row[data_members[0]]);

    
    let cartID = document.createElement("th");
    cartID.innerHTML = row[data_members[0]].toString();
    

    new_row.appendChild(cartID);

    for (let data = 1; data < 3; data++){
        let data_cell = document.createElement("td");
        
        let data_input_cell = document.createElement("input");

        data_input_cell.setAttribute("type", "text");

        if (row[data_members[data]] == ""){
            data_input_cell.setAttribute("value", "");
            
        } else {
            data_input_cell.setAttribute("value", row[data_members[data]]);
        };

        data_input_cell.disabled = true;
        data_cell.appendChild(data_input_cell);
        new_row.appendChild(data_cell);
    }
    
    let update_td = document.createElement("td");
    let update_button = document.createElement("button");
    update_button.textContent = "UPDATE";
    update_button.className = "btn-sm btn-secondary";
    update_td.appendChild(update_button);
    new_row.appendChild(update_td);

    let delete_td = document.createElement("td");
    let delete_button = document.createElement("button");
    delete_button.textContent = "DELETE";
    delete_button.className = "btn-sm btn-danger";
    delete_td.appendChild(delete_button);
    new_row.appendChild(delete_td);

    return new_row;
};

// INSERT data event listener
document.getElementById("add-button").addEventListener("click", async (event) => {

    event.preventDefault();

    // if name entry is blank
    if (document.getElementById("cartsCost").value == ""){
        return;
    };

    var select = document.getElementById('cartStatus');
    var selected_option = select.options[select.selectedIndex].text;
    if (selected_option == "Closed"){
        var status = 0;
    } else if (selected_option == "Active"){
        var status = 1;
    };

    let bodyJson = { 
        totalCost: document.getElementById("cartsCost").value, 
        status: status 
    };

    const postRequest = {
        method: "POST",
        body: JSON.stringify(bodyJson),
        headers: {"Content-Type": "application/json"}
    };
    
    let response = await fetch(baseUrl, postRequest).then(response => response.json());
    makeTable(response);
    
});

/* Function to UPDATE */
async function onUpdate(target, target_id, clickedButton) {
    list_data = target.childNodes;

    if (clickedButton == "UPDATE"){
        for (var column = 0; column < list_data.length - 2; column++){
            var child = list_data[column].childNodes;
            child[0].disabled = false;
        };

        var button = list_data[3].childNodes;
        button[0].textContent = "DONE";
        return;

    } else if (clickedButton == "DONE"){
        for (var material = 1; material < list_data.length - 2; material++){
            var child = list_data[material].childNodes;
            if (material == 1) {
                var cost_value = child[0].value;
            } else if (material == 2) {
                var select = list_data[material].childNodes;
                var selected_option = select[0].options[select[0].selectedIndex].text;
                if (selected_option == "Closed"){
                    var status_value = 0;
                } else if (selected_option == "Status"){
                    var status_value = 1;
                }
        }
    }
        var bodyJson = { 
            totalCost: cost_value, 
            status: status_value, 
            cartID: target_id
        };

        const putRequest = {
            method: "PUT",
            body: JSON.stringify(bodyJson),
            headers: {"Content-Type": "application/json"}
        };

        var response = await fetch(baseUrl, putRequest).then(reponse => reponse.json());
        makeTable(response);
    };
};

/* Function to UPDATE */
async function onUpdate(target, target_id, clickedButton) {
    list_data = target.childNodes;

    if (clickedButton == "UPDATE"){
        for (var column = 0; column < list_data.length - 2; column++){
            var child = list_data[column].childNodes;
            child[0].disabled = false;
        };

        var button = list_data[3].childNodes;
        button[0].textContent = "DONE";
        return;

    } else if (clickedButton == "DONE"){
        for (var material = 1; material < list_data.length - 2; material++){
            var child = list_data[material].childNodes;
            if (material == 1) {
                var cost_value = child[0].value;
            } else if (material == 2) {
                var selected = child[0].value;
                if (selected == "No"){
                    var status_value = 0;
                } else if (selected == "Yes"){
                    var status_value = 1;
                }
        }
    }
        var bodyJson = { 
            totalCost: cost_value, 
            status: status_value, 
            cartID: target_id
        };

        const putRequest = {
            method: "PUT",
            body: JSON.stringify(bodyJson),
            headers: {"Content-Type": "application/json"}
        };

        var response = await fetch(baseUrl, putRequest).then(reponse => reponse.json());
        makeTable(response);
    };
};


/* Function to DELETE */
async function onDelete(target_id) {
    console.log("delete request sent", target_id);

    const deleteRequest = {
        method: "DELETE",
        body: JSON.stringify({cartID: target_id}),
        headers: {"Content-Type": "application/json"}
    };
    
    var response = await fetch(baseUrl, deleteRequest).then(reponse => reponse.json());
    makeTable(response);
};

/* Event listeners for UPDATE/DELETE buttons */
tableBody.addEventListener('click', (event) => {
    event.preventDefault();

    let target = event.target;                                  // row to update/delte
    let clickedButton = event.target.textContent;

    while (target.tagName != "TR"){
        target = target.parentNode;                             // move up through DOM until tr tag
    };
    target_id = parseInt(target.id);
        
    if (clickedButton == "UPDATE" || clickedButton == "DONE"){
        onUpdate(target, target_id, clickedButton);
    } else if (clickedButton == "DELETE") {
        onDelete(target_id);
    } else {
        return;
    } 
});

const startTable = async () => {
    let start = await fetch(baseUrl).then(response => response.json()).then((data) => makeTable(data));
}

startTable();