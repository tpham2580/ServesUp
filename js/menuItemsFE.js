const baseUrl = `http://flip2.engr.oregonstate.edu:5995/`;

var tableBody = document.getElementById("menuItemTable");

const makeTable = (allRows) => {
    //clears the table
    tableBody.innerHTML = "";

    //Iterate through rows
    for (let row = 0; row < allRows.rows.length; row++){
        tableBody.appendChild(makeRow(allRows.rows[row]));
    };
};

const makeRow = (row) => {
    let new_row = document.createElement("tr");
    new_row.setAttribute("id", row["menuID"]);

    let data_members = ['menuID', 'menuName', 'catID', 'unitPrice', 'description', 'producer', 'year'];

    for (let data = 0; data < 7; data++){
        let data_cell = document.createElement("td");
        

        let data_input_cell = document.createElement("input");

        if (data == 0 || data == 2 || data == 3 || data == 6) {
            data_input_cell.setAttribute("type", "number");

            if (row[data_members[data]] == ""){
                data_input_cell.setAttribute("value", "");
                
            } else {
                data_input_cell.setAttribute("value", row[data_members[data]]);
            };

            data_cell.appendChild(data_input_cell);

        } else if (data == 1 || data == 4 || data == 5) {
            data_input_cell.setAttribute("type", "text");

            if (row[data_members[data]] == ""){
                data_input_cell.setAttribute("value", "");
                
            } else {
                data_input_cell.setAttribute("value", row[data_members[data]]);
            };

            data_cell.appendChild(data_input_cell);

        };
        
        data_input_cell.disabled = true;
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
document.getElementById("addInput").addEventListener("click", async function(event) {

    event.preventDefault();

    // if name entry is blank
    if (document.getElementById("menuItemName").value == ""){
        return;
    };

    let bodyJson = { 
        menuName: document.getElementById('menuItemName').value, 
        catID: document.getElementById('menuItemCategory').value,
        unitPrice: document.getElementById('menuItemPrice').value,
        description: document.getElementById('menuItemDesc').value,
        producer: document.getElementById('menuItemProducer').value,
        year: document.getElementById('menuItemYear').value,
    };


    const postRequest = {
        method: "POST",
        body: JSON.stringify(bodyJson),
        headers: {"Content-Type": "application/json"}
    };
    
    let response = await fetch(baseUrl, postRequest).then(response => response.json());
    makeTable(response);
    
});

// SEARCH data event listener
document.getElementById("searchMenuItems").addEventListener("click", async function(event) {

    event.preventDefault();

    // if name entry is blank
    if (document.getElementById("searchItem").value == ""){
        return;
    };

    let searchItem = document.getElementById('searchItem').value;
    
    let response = await fetch(baseUrl + "search/" + encodeURI(searchItem)).then(response => response.json());
    makeTable(response);
});

// Reset Search data event listener
document.getElementById("resetSearch").addEventListener("click", async function(event) {

    event.preventDefault();
    
    let response = await fetch(baseUrl + "resetSearch").then(response => response.json());
    makeTable(response);

});


async function onUpdate(target, target_id, clickedButton) {
    list_data = target.childNodes;

    if (clickedButton == "UPDATE"){
        for (var column = 0; column < list_data.length - 2; column++){
            var child = list_data[column].childNodes;
            child[0].disabled = false;
        };

        var button = list_data[7].childNodes;
        button[0].textContent = "DONE";
        return;

    } else if (clickedButton == "DONE"){
        for (var material = 0; material < list_data.length - 2; material++){
            var child = list_data[material].childNodes;
            if (material == 0) {
                var id_value = child[0].value;
            } else if (material == 1) {
                var name_value = child[0].value;
            } else if (material == 2) {
                if(child[0].value ==""){
                    let cat_value = null;
                }else{
                var cat_value = child[0].value;
                }
            } else if (material == 3) {
                var price_value = child[0].value;
            } else if (material == 4) {
                var desc_value = child[0].value;
            } else if (material == 5) {
                var prod_value = child[0].value;
            } else if (material == 6) {
                var year_value = child[0].value;
            }
        }

        var bodyJsonValues = { 
            menuName: name_value, 
            catID: cat_value, 
            unitPrice: price_value,
            description: desc_value,
            producer: prod_value,
            year: year_value,
            menuID: target_id
        };


        const putRequest = {
            method: "PUT",
            body: JSON.stringify(bodyJsonValues),
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
        body: JSON.stringify({menuID: target_id}),
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
    let start = await fetch(baseUrl).then(response => response.json());
    makeTable(start);
}

startTable();