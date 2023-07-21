const zip = (xs, ys) => {
    const zipped = [];
    for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]]);
    }
    return zipped;
};

const diffAttrs = (oldAttrs, newAttrs) => {
    const patchs = []
    for(const [k, v] of Object.entries(newAttrs)){
        patchs.push($node => {
            $node.setAttribute(k, v)
            return $node
        })
    }

    for(const k in oldAttrs){
        if(!(k in newAttrs)){
            patchs.push($node => {
                $node.removeAttribute(k)
                return $node
            })
        }
    }

    return $node => {
        for(const patch of patchs){
            patch($node)
        }
    }
}

const diffChildren = (vOldChildren, vNewChildren) => {
    const patches = []
    vOldChildren.forEach(
        (child, i) => {
            patches.push(
                diff(child, vNewChildren[i])
            )
        }
    );

    const additionalPatches = [];
    for (const additionalVChild of vNewChildren.slice(vOldChildren.length)) {
        additionalPatches.push(
            $node => {
                $node.appendChild(
                    render(additionalVChild)
                );
                return $node;
            }
        )
    }

    return $parents => {
        for(const [patch, child] of zip(patches, $parents.childNodes)){
            patch(child)
        }
        for(const patch of additionalPatches){
            patch($parents)
        }
        return $parents
    }
}

const diff = (vOldNode, vNewNode) => { 
    if(vNewNode === undefined){
        return $node => {
            $node.remove()
            return undefined
        }
    }

    if(typeof(vOldNode) === "string" || typeof(vNewNode) === "string"){
        if(vOldNode !== vNewNode){
            return $node => {
                const $newNode = render(vNewNode)
                $node.replaceWith($newNode)
                return $newNode
            }
        }
        else{
            return $node => undefined
        }
    }

    if(vOldNode.TagName !== vNewNode.TagName){
        return $node => {
            const $newNode = render(vNewNode)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children)

    return $node => {
        patchAttrs($node)
        patchChildren($node)
        return $node
    }
}

const mount = ($node, $target) => {
    $target.replaceWith($node)
    return $node
}

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

const createElement = (TagName, { attrs = {}, children = [] } = {}) => {
    return {
        TagName,
        attrs,
        children,
    }
}

const createVApp = (count) => createElement("div", {
    attrs: {id:"app", datacount:count},
    children: [
        createElement("input"),
        String(count),
        ...Array.from({length: count}, () => 
            createElement("img", {
                attrs: {src: "https://http.cat/100"}, 
            })
        ),
    ]
})

let ccc = 0
let vApp = createVApp(ccc)
const $app = render(vApp)
let $rootElement = mount($app, document.getElementById("app"))
setInterval( () => {
    const vNewApp = createVApp(++ccc)
    const patch = diff(vApp, vNewApp)
    $rootElement = patch($rootElement)
    vApp = vNewApp
}, 1000)
console.log($rootElement)