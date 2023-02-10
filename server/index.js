const XLSX = require("xlsx");
const express = require("express");
var postmark = require("postmark");
var fs = require("fs");

const arr = [];
fetch("http://localhost:5000/companies_b2b_enbro/")
    .then((response) => response.json())
    .then((data) => {
        arr.push(...data);

        const convertJsonToExcel = () => {
            const filteredData = arr.map((x) => {
                return {
                    Email: x?.ContactEmail[1],
                    Name: x?.ContactFN[1],
                    LastName: x?.ContactLN[1],
                    Language: x?.Language[1],
                    Gas: x?.Gas,
                    Electricity: x?.Electricity,
                };
            });
            //console.log(filteredData);
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workBook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workBook, worksheet, "data");
            //buffer
            XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

            XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(workBook, "./exports/myData.xlsx");
        };

        convertJsonToExcel();
    });

// Send an email:
var client = new postmark.ServerClient("");



client.sendEmail(
    {
        From: "robert.zimerman@enbro.com",
        To: "robert.zimerman@enbro.com",
        Subject: "Your export",
        HtmlBody: "<strong>Here is your export</strong> .",
        TextBody: "Here is the export you requiested!",
        Attachments: [
            {
                Content: fs.readFileSync("./exports/myData.xlsx").toString("base64"),
                Name: "myData.xlsx",
                ContentType: "xlsx",
            },
        ],
    },
    function (error, result) {
        if (error) {
            console.error("Unable to send via postmark: " + error.message);
            return;
        }
        console.info("Sent to postmark for delivery");
    }
);
