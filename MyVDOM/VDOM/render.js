const renderElement = ({ TagName, attrs, children }) => {
    const $el = document.createElement(TagName)
    for(const [k, v] of Object.entries(attrs)){
        $el.setAttribute(k, v)
    }
    for(const child of children){
        const $child = render(child)
        $el.appendChild($child)
    }
    return $el
}

const render = (vNode) => {
    if(typeof(vNode) === "string"){
        return document.createTextNode(vNode)
    }
    return renderElement(vNode)
}

export default render