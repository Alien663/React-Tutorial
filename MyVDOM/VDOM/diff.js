import render from './render.js'

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

const diffChildren = (oldChildren, newChildren) => {
    const childPatches = []
    for(const [oldChild, newChild] of zip(oldChildren, newChildren)){
        childPatches.push(diff(oldChild, newChild))
    }

    const additionalPatches = [];
    for (const additionalVChild of newChildren.slice(oldChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    }

    return $parents => {
        for(const [patch, child] of zip(childPatches, $parents.childNodes)){
            patch(child)
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
            const $newNode = render(vNewNode)
            $node.replaceWith($newNode)
            return $newNode
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

export default diff