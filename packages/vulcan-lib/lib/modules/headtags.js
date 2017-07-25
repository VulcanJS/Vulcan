export const Headtags = {
  meta: [],
  link: [],
  script: [],
}

export const removeFromHeadTags = (type, name)=>{
  HeadTags[type] = HeadTags[type].filter((tag)=>{
    return (!tag.name || tag.name && tag.name !== name)
  });

  return HeadTags;
}
