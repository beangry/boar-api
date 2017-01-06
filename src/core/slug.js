const slug = string => string.toLowerCase().trim().replace(/([^a-z0-9]+)/g, '-')

export default slug
