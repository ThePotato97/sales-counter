import logo from "./logo.svg";
import styles from "./App.module.css";
import { Box, Button, Grid, Paper, Typography } from "@suid/material";
import { createSignal } from "solid-js";

type AssetData = {
  "Asset Id": string;
  "Asset Name": string;
  "Asset Type": string;
  "Buyer User Id": string;
  "Date and Time": string;
  "Hold Status": string;
  Id: string;
  Location: string;
  "Location Id": string;
  Price: string;
  Revenue: string;
  Universe: string;
  "Universe Id": string;
};

function App() {
  const [current, setCurrent] = createSignal<
    { amount: number; info: AssetData }[]
  >([]);

  const handleFileRead = (e: any) => {
    const content = e.target.result;
    console.log(content);
    // Step 1: Parse the CSV header
    const lines = content.split("\n");
    const header = lines[0].split(",");

    // Step 2: Create an array to store the objects
    const csvArray: AssetData[] = [];

    // Loop through the remaining lines (data rows)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(",");
      const obj = {};

      // Loop through the header keys and assign values from the data row
      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = line[j];
      }

      // Add the object to the csvArray
      csvArray.push(obj);
    }
    // Now csvArray contains an array of objects with keys from the header
    console.log(csvArray);
    const organized = csvArray
      .filter((a) => {
        return a["Asset Id"] !== undefined;
      })
      .reduce((acc, item) => {
        const id = item["Asset Id"];
        const price = item["Price"];
        const unique = `${id}-${price}`;
        if (acc[unique]) {
          acc[unique].amount += 1;
        } else {
          acc[unique] = {
            info: item,
            unique: unique,
            amount: 1,
          };
        }
        return acc;
      }, {});
    console.log(Object.values(organized));
    setCurrent(Object.values(organized));
  };

  const handleFileChosen = (file: any) => {
    let fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Button variant="contained" component="label">
          Upload File
          <input
            onChange={(e) => handleFileChosen(e.target.files[0])}
            type="file"
            hidden
          />
        </Button>
        <Paper>
          {current().length > 0 ? (
            <>
              <Typography variant="h1">Top Items</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <Box>Name</Box>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Box>Amount</Box>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <Box>Price (Robux)</Box>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <Box>Total (Robux)</Box>
                  </Grid>
                  {current().length > 0 ? (
                    current().map((transaction) => {
                      return (
                        <>
                          <Grid item xs={6} md={4}>
                            <Box>{transaction.info["Asset Name"]}</Box>
                          </Grid>
                          <Grid item xs={6} md={4}>
                            <Box>{transaction.amount}</Box>
                          </Grid>
                          <Grid item xs={4} md={2}>
                            <Box>{transaction.info["Revenue"]}</Box>
                          </Grid>
                          <Grid item xs={4} md={2}>
                            <Box>
                              {transaction.amount *
                                Number(transaction.info["Revenue"])}
                            </Box>
                          </Grid>
                        </>
                      );
                    })
                  ) : (
                    <Typography variant="h1">Select a file</Typography>
                  )}
                </Grid>
              </Box>
            </>
          ) : (
            <Typography variant="h1">Select a file</Typography>
          )}
        </Paper>
      </header>
    </div>
  );
}

export default App;
