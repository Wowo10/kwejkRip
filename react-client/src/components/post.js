import React from "react"
import PropTypes from "prop-types"

function Post(props) {
  return (
    <div
      ref={props.forwardedRef}
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  )
}

Post.propTypes = {
  forwardedRef: PropTypes.func,
  html: PropTypes.string.isRequired,
}

export { Post }
