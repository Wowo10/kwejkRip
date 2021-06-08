import React, { useState, useEffect, useRef, useCallback } from "react"
import { Post } from "./post"

function Body() {
  const [posts, setPosts] = useState([])
  const [pageNumber, setpageNumber] = useState(0)

  useEffect(() => {
    addPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getCourses(pageNumber) {
    return fetch(`http://localhost:3001/page/${pageNumber ?? ""}`)
      .then(handleResponse)
      .catch(handleError)
  }

  function addPosts(pagenumber) {
    getCourses(pagenumber).then(({ htmls, currentPageNumberElement }) => {
      setPosts(posts.concat(htmls))
      setpageNumber(currentPageNumberElement)
      console.log(currentPageNumberElement)
    })
  }

  async function handleResponse(response) {
    if (response.ok) return response.json()
    if (response.status === 400) {
      const error = await response.text()
      throw new Error(error)
    }
    throw new Error("Network response was not ok.")
  }

  function handleError(error) {
    console.error("API call failed. " + error)
    throw error
  }

  const observer = useRef()
  const lastBookElementRef = useCallback((node) => {
    // if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        addPosts(pageNumber - 1)
      }
    })
    if (node) observer.current.observe(node)
  })

  return (
    <>
      <div>
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <Post
                forwardedRef={lastBookElementRef}
                html={post}
                key={index}
              ></Post>
            )
          } else {
            return <Post html={post} key={index}></Post>
          }
        })}
      </div>
      <div>
        <button
          onClick={() => {
            addPosts(pageNumber - 1)
          }}
        >
          Następna strona
        </button>
      </div>
    </>
  )
}

export { Body }
