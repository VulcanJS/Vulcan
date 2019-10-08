const terminatingLinksRegistry = [];
const linksRegistry = [];

// register one or more links
export const registerLink = (link) => {
    const links = Array.isArray(link) ? link : [link];
    linksRegistry.unshift(...links);
};

export const registerTerminatingLink = (link) => {
    const links = Array.isArray(link) ? link : [link];
    terminatingLinksRegistry.push(...links);
};



export const getLinks = () => linksRegistry;
export const getTerminatingLinks = () => terminatingLinksRegistry;
