//THIS OBJECT HOLDS .... AND IT IS USED FOOR ....
const storesDataObj = {
    ballerup: [
      "Ballerup Centret-Føtex",
      "Ballerup Borupvang2-Føtex",
      "Ballerup Centret-Netto",
      "Ballerup Vestbuen 157-Netto",
    ],
    herlev: [
      "Herlev Big Shopping-Føtex",
      "Herlev Bygade 9-Føtex",
      "Herlev Big Shopping-Netto",
      "Herlev Tvedvangen 201-Netto",
    ],
    vanløse: [
      "Vanløse Torv-Føtex",
      "Vanløse Jyllingevej 9-Netto",
      "Vanløse Jernbane Allé 36-Netto",
    ],
  };
  
 //THIS OBJECT HOLDS STORES NAME AND IDS, AND IT IS USED FOOR .... 
 const storesIDObj= {
  "Ballerup Centret-Føtex": "c891c2a5-e302-4204-a7f5-8132ff5f5856",
  "Ballerup Borupvang2-Føtex": "cd348cf3-07ae-4af4-a321-d8e6382183b2",
  "Ballerup Centret-Netto": "451116d7-397d-4751-b09d-fbbb35520065",
  "Ballerup Grantoftecentret-Netto": "8b7eb697-d505-431f-ad89-835d324cf2e7",
  "Herlev Big Shopping-Føtex": "a4ae5b26-ec5b-4331-8d52-f898ceef6c02",
  "Herlev Bygade 9-Føtex": "d902d333-9f2c-432d-bd2c-fa823b80306b",
  "Herlev Big Shopping-Netto": "cb1fdce2-9862-453b-8d22-a6d9abb2eaaf",
  "Herlev Tvedvangen 201-Netto": "edc497b9-5be3-40c8-b8bc-e70f1195b6d6",
  "Vanløse Torv-Føtex": "4956b28a-0bfd-4766-8146-ec2c70812e6a",
  "Vanløse Jyllingevej 9-Netto": "0b52d54b-66e1-4d8c-a4a4-e243b5120946",
  "Vanløse Jernbane Allé 36-Netto": "c2f95cbd-f178-4080-b3c0-04a05a3ded65",
};



const storeDropdown = document.getElementById("storesDropdown");
const zipDropdown = document.getElementById("zipcode");
  
//THIS EVENT LISTNER FUNCTION IS USED FOR ....
document.getElementById("zipcode").onchange = function() 
{
  // EMPTYING THE STORE SELECT/DROPDOWN BEFORE ADDING NEW STORES 
  let optionVal = storeDropdown.getElementsByTagName("option") ;
  for (let i = optionVal.length ; i--;)
   {
    storeDropdown.removeChild(optionVal[i])
  }
    // ADDING OPTIONS VALUE TO THE STORE SELECT/DROPDOWN
    let zipVal = zipDropdown.value;
    for (let key in storesDataObj) 
    {
        if ( key == zipVal) 
        {
              for (let i = 0; i < storesDataObj[key].length; i++ )
              {
                let optionVal = document.createElement("option");
                  optionVal.setAttribute ("value",key);
                  let optionText = document.createTextNode(storesDataObj[key][i]);
                  optionVal.appendChild(optionText);
                  storeDropdown.appendChild(optionVal);
            }
          }
    }

}
 

// ADDING EVENTLISTNER FUNCITON TO SEARCH BUTTON
document.getElementById("foodSearchButton").addEventListener("click",fetchFoodItem);

//THE BELOW EVENT LISTNER FUNCITON CONTAIINS THE MAIN LOGIC FOR FOOD ITEM SEARCH PER STORE
async function fetchFoodItem() 
    {
        var storeElement = document.getElementById("storesDropdown");
        var selectedStoreText = storeElement.options[storeElement.selectedIndex].text;
        var storeID =storesIDObj[selectedStoreText];

        //Calling REST API in JS
        var apiurl = "https://api.sallinggroup.com/v1/food-waste/" + storeID;

        //console.log(apiurl);
        const response = await fetch(apiurl, 
            {
                method: "GET",
                headers: {Authorization: "Bearer 806feb67-aabe-4103-9d45-bddd4160995b"}
            });
        const fetchedAPIData = await response.json();
        const discountedItemsDetails = fetchedAPIData.clearances;

        // if there are existing tables in the HTML documents and  delete them before creating a new one.
        var tables = document.getElementsByTagName("TABLE");
        for (var i = tables.length - 1; i >= 0; i -= 1)
            if (tables[i]) tables[i].parentNode.removeChild(tables[i]);


        // creates a <table> element and a <tbody> element
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");
        const productdetail = ["PRODUCT DESCRIPTION", "ARTICLE NO", "ORIGINAL PRICE", "NEW PRICE", "%DISCOUNT","STOCK","IMAGE"];

        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) 
            {
                // Create a <td> element and a text node, make the text
                // node the contents of the <td>, and put the <td> at
                // the end of the table row
                const cell = document.createElement("td");
                const cellText = document.createTextNode(productdetail[j]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
        tblBody.appendChild(row);
        const itemDetailsForEachCell = ["pd", "an", "op", "np", "dis","stock","img"];
       for (let i = 0; i < fetchedAPIData.clearances.length; i++ )
            {
                const row = document.createElement("tr");  
                itemDetailsForEachCell[0]=fetchedAPIData.clearances[i].product.description;
                itemDetailsForEachCell[1]=fetchedAPIData.clearances[i].offer.ean;
                itemDetailsForEachCell[2]=fetchedAPIData.clearances[i].offer.originalPrice;
                itemDetailsForEachCell[3]=fetchedAPIData.clearances[i].offer.newPrice;
                itemDetailsForEachCell[4]=fetchedAPIData.clearances[i].offer.percentDiscount;
                itemDetailsForEachCell[5]=fetchedAPIData.clearances[i].offer.stock;
                itemDetailsForEachCell[6]=fetchedAPIData.clearances[i].product.image

                for ( let j = 0; j <7 ; j++ )
                    {
                        const cell = document.createElement("td");
                        // Embed image from the Image source URL  into the table cell 
                        if ( j < 6)
                            {
                                const cellText = document.createTextNode(itemDetailsForEachCell[j]);
                                cell.appendChild(cellText);
                                row.appendChild(cell);
                            } 
                        else 
                            {
                                var img = document.createElement("img");
                                img.src = itemDetailsForEachCell[j];
                                img.style.height = "80px";
                                img.style.width = "80px";
                                cell.appendChild(img);
                                row.appendChild(cell);
                            }
        
                    } 
                  tblBody.appendChild(row);
                // put the <tbody> in the <table>
                tbl.appendChild(tblBody);
                // appends <table> into <body>
                document.body.appendChild(tbl);
                // sets the border attribute of tbl to '2'
                tbl.setAttribute("border", "1");
                tbl.setAttribute("id","itemTableID");
                tbl.setAttribute("class","container2")
        }
}

























