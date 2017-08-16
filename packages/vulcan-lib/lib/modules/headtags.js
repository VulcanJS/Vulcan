export const Head = {
  meta: [],
  link: [],
  script: [],
}

export const removeFromHeadTags = (type, name)=>{
  Head[type] = Head[type].filter((tag)=>{
    return (!tag.name || tag.name && tag.name !== name)
  });

  return Head;
}
