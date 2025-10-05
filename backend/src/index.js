import app from "./app.js"

import db from "./lib/db.js"
db()

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
  console.log(process.env.BASE_URL)
})
