const createElement = (TagName, { attrs = {}, children = [] }) => {
    return {
        TagName,
        attrs,
        children,
    }
}

export default createElement