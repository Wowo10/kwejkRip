const express = require("express")
const cors = require("cors")
const app = express()
const port = 3001

app.use(cors())

app.get("/page/:pageNumber?", ({ params }, res) => {
  const https = require("https")

  https
    .get(
      `https://kwejk.pl${
        !!params.pageNumber ? `/strona/${params.pageNumber}` : ""
      }`,
      (resp) => {
        let data = ""

        resp.on("data", (chunk) => {
          data += chunk
        })

        resp.on("end", () => {
          var { JSDOM } = require("jsdom")
          var doc = new JSDOM(data)

          const container =
            doc.window.document.getElementsByClassName("feed-top-padding")[0]
          const elements = container.getElementsByClassName(
            "media-element-wrapper"
          )

          const currentPageNumberElement =
            doc.window.document.getElementsByClassName("current")[0]

          let htmls = []
          for (el of elements) {
            const players = el.getElementsByTagName("player")

            if (players.length > 0) {
              let videoElement = `<video controls>
              <source
                src="${players[0].getAttribute("source")}"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>`

              htmls.push(videoElement)
            } else {
              htmls.push(el.outerHTML)
            }
          } //change videos into ones that work outside of kwejk.pl

          res.send({
            htmls: htmls,
            currentPageNumberElement:
              currentPageNumberElement?.textContent.trim(),
          })
        })
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message)
    })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
