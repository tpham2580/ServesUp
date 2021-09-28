const baseUrl = `http://flip2.engr.oregonstate.edu:5995/productCategories`;

var tableBody = document.getElementById("productCategoryTable");

const makeTable = (allRows) => {
    //clears the table
    tableBody.innerHTML = "";

    let header_row = document.createElement("tr");
    let categoryID = document.createElement("th");
    let beverageType = document.createElement("th");
    let productSpec = document.createElement("th");
    categoryID.textContent = "Category ID";
    beverageType.textContent = "Beverage Type";
    productSpec.textContent = "Product Spec";
    header_row.appendChild(categoryID)
    header_row.appendChild(beverageType)
    header_row.appendChild(productSpec)
    tableBody.appendChild(header_row)

    //Iterate through rows
    for (let row = 0; row < allRows.rows.length; row++){
        tableBody.appendChild(makeRow(allRows.rows[row]));
    };
};

const makeRow = (row) => {
    const data_members = ['categoryID', 'beverageType', 'productSpec'];

    let new_row = document.createElement("tr");
    new_row.setAttribute("id", row[data_members[0]]);

    
    let categoryID = document.createElement("th");
    categoryID.innerHTML = row[data_members[0]].toString();
    

    new_row.appendChild(categoryID);

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
    update_td.appendChild(update_button);
    new_row.appendChild(update_td);

    let delete_td = document.createElement("td");
    let delete_button = document.createElement("button");
    delete_button.textContent = "DELETE";
    delete_td.appendChild(delete_button);
    new_row.appendChild(delete_td);

    return new_row;
};

// add data event listener
document.getElementById("add-button").addEventListener("click", async (event) => {

    event.preventDefault();

    // if name entry is blank
    if (document.getElementById("productCategorySpec").value == ""){
        return;
    };

    let bodyJson = { 
        beverageType: document.getElementById("productCategoryBevType").value, 
        productSpec: document.getElementById("productCategorySpec").value, 
    };

    const postRequest = {
        method: "POST",
        body: JSON.stringify(bodyJson),
        headers: {"Content-Type": "application/json"}
    };
    
    let response = await fetch(baseUrl, postRequest).then(response => response.json());
    makeTable(response);
    
});

const onUpdate = async (target, target_id, clickedButton) => {
    list_data = target.childNodes;

    if (clickedButton == "UPDATE"){
        for (let column = 1; column < list_data.length - 2; column++){
            let child = list_data[column].childNodes;
            child[0].disabled = false;
        };

        let button = list_data[3].childNodes;
        button[0].textContent = "DONE";
        return;

    } else if (clickedButton == "DONE"){
        for (let material = 1; material < list_data.length - 2; material++){
            let child = list_data[material].childNodes;
            if (material == 1) {
                var beverageType_value = child[0].value;
            } else if (material == 2) {
                var productSpec_value = child[0].value;
            } 
        }

        let bodyJson = { 
            categoryID: target_id, 
            beverageType: beverageType_value, 
            productSpec: productSpec_value
        };

        const putRequest = {
            method: "PUT",
            body: JSON.stringify(bodyJson),
            headers: {"Content-Type": "application/json"}
        };

        let response = await fetch(baseUrl, putRequest)
        .then(response => response.json())
        .then((data) => makeTable(data))
        ;
    };

};

const onDelete = async (target_id) => {
    console.log("delete request sent");

    const deleteRequest = {
        method: "DELETE",
        body: JSON.stringify({categoryID: target_id}),
        headers: {"Content-Type": "application/json"}
    };
    
    let response = await fetch(baseUrl, deleteRequest).then(reponse => reponse.json());
    makeTable(response);
};

// actions for update and delete
tableBody.addEventListener('click', (event) => {
    event.preventDefault();

    let target = event.target;
    let clickedButton = event.target.textContent;

    while (target.tagName != "TR"){
        target = target.parentNode;
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