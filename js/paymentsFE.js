const baseUrl = `http://flip2.engr.oregonstate.edu:5995/payments`;

var tableBody = document.getElementById("paymentsTable");

const makeTable = (allRows) => {
    //clears the table
    tableBody.innerHTML = "";

    let header_row = document.createElement("tr");
    let paymentID = document.createElement("th");
    let cartID = document.createElement("th");
    let date = document.createElement("th");
    let tipAmount = document.createElement("th");
    let totalAmount = document.createElement("th");
    let paymentType = document.createElement("th");
    paymentID.textContent = "Payment ID";
    cartID.textContent = "Cart ID";
    date.textContent = "Date";
    tipAmount.textContent = "Tip Amount (USD)";
    totalAmount.textContent = "Total Amount (USD)";
    paymentType.textContent = "Payment Type";
    header_row.appendChild(paymentID)
    header_row.appendChild(cartID)
    header_row.appendChild(date)
    header_row.appendChild(tipAmount)
    header_row.appendChild(totalAmount)
    header_row.appendChild(paymentType)
    tableBody.appendChild(header_row)

    //Iterate through rows
    for (let row = 0; row < allRows.rows.length; row++){
        tableBody.appendChild(makeRow(allRows.rows[row]));
    };
};

const makeRow = (row) => {
    const data_members = ['paymentID', 'cartID', 'date', 'tipAmount', 'totalAmount', 'paymentType'];

    let new_row = document.createElement("tr");
    new_row.setAttribute("id", row[data_members[0]]);

    
    let categoryID = document.createElement("th");
    categoryID.innerHTML = row[data_members[0]].toString();
    

    new_row.appendChild(categoryID);

    for (let data = 1; data < 6; data++){
        let data_cell = document.createElement("td");
        
        let data_input_cell = document.createElement("input");

        if (row[data_members[data]] == ""){
            data_input_cell.setAttribute("value", "");
            
        } else {
            data_input_cell.setAttribute("value", row[data_members[data]]);
        };

        if (data == 2) {
            data_input_cell.setAttribute("type", "datetime-local");
            console.log(row[data_members[data]]);
            data_input_cell.setAttribute("value", row[data_members[data]].slice(0, 19));
        } else if (data == 5) {
            data_input_cell.setAttribute("type", "text");
            data_input_cell.setAttribute("value", row[data_members[data]]);
        } else {
            data_input_cell.setAttribute("type", "number");
            data_input_cell.setAttribute("step", "0.01");
            data_input_cell.setAttribute("value", row[data_members[data]]);
        }

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
    if (document.getElementById("paymentsCartID").value == "" || 
        document.getElementById("paymentsDate").value == "" ||
        document.getElementById("paymentsAmount").value == "" ||
        document.getElementById("paymentsType").value == ""){
        return;
    };

    let bodyJson = { 
        cartID: document.getElementById("paymentsCartID").value, 
        date: document.getElementById("paymentsDate").value, 
        tipAmount: document.getElementById("paymentsTip").value, 
        totalAmount: document.getElementById("paymentsAmount").value, 
        paymentType: document.getElementById("paymentsType").value, 
    };

    const postRequest = {
        method: "POST",
        body: JSON.stringify(bodyJson),
        headers: {"Content-Type": "application/json"}
    };
    
    let response = await fetch(baseUrl, postRequest).then(response => response.json()).then((data) => makeTable(data));
    
});

const onUpdate = async (target, target_id, clickedButton) => {
    list_data = target.childNodes;

    if (clickedButton == "UPDATE"){
        for (let column = 1; column < list_data.length - 2; column++){
            let child = list_data[column].childNodes;
            child[0].disabled = false;
        };

        let button = list_data[6].childNodes;
        button[0].textContent = "DONE";
        return;

    } else if (clickedButton == "DONE"){
        for (let material = 1; material < list_data.length - 2; material++){
            let child = list_data[material].childNodes;
            if (material == 1) {
                var cartID_value = child[0].value;
            } else if (material == 2) {
                let new_date = new Date(child[0].value);
                console.log(new_date.toISOString().slice(0, 19). replace('T', ' '));
                console.log(new_date.getTimezoneOffset());
                new_date.setMinutes(new_date.getMinutes() - (new_date.getTimezoneOffset() + 7 * 60));
                console.log(new_date.toISOString().slice(0, 19). replace('T', ' '));
                var date_value = new_date.toISOString().slice(0, 19). replace('T', ' ');
            } else if (material == 3) {
                var tipAmount_value = child[0].value;
            } else if (material == 4) {
                var totalAmount_value = child[0].value;
            } else if (material == 5) {
                var paymentType_value = child[0].value;
            } 
            
        }

        let bodyJson = { 
            paymentID: target_id, 
            cartID: cartID_value, 
            date: date_value,
            tipAmount: tipAmount_value,
            totalAmount: totalAmount_value,
            paymentType: paymentType_value
            
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
        body: JSON.stringify({paymentID: target_id}),
        headers: {"Content-Type": "application/json"}
    };
    
    let response = await fetch(baseUrl, deleteRequest).then(response => response.json());
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