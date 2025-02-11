const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const memberTemplate = path.resolve('./src/templates/member.js');
const jobTemplate = path.resolve('./src/templates/job.js');
const sectorTemplate = path.resolve('./src/templates/sector.js');
const projectTemplate = path.resolve('./src/templates/project.js');

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === 'MarkdownRemark') {
    const { createNodeField } = actions;
    const slug = createFilePath({ node, getNode });
    createNodeField({
      node,
      name: 'slug',
      value: slug
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const memberResults = await graphql(`
    query {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/team/" } }) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const sectorResults = await graphql(`
    query {
      allMarkdownRemark(filter: { frontmatter: { type: { eq: "sector" } } }) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              name
            }
          }
        }
      }
    }
  `);

  const projectResults = await graphql(`
    query {
      allMarkdownRemark(filter: { frontmatter: { type: { eq: "project" } } }) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              name
            }
          }
        }
      }
    }
  `);

  const members = memberResults.data.allMarkdownRemark.edges;
  const sectors = sectorResults.data.allMarkdownRemark.edges;
  const projects = projectResults.data.allMarkdownRemark.edges;

  members.forEach((member) => {
    createPage({
      path: member.node.fields.slug,
      component: memberTemplate,
      context: {
        id: member.node.id
      }
    });
  });

  sectors.forEach((sector) => {
    createPage({
      path: sector.node.fields.slug,
      component: sectorTemplate,
      context: {
        id: sector.node.id,
        nameRegex: `/${sector.node.frontmatter.name}/`
      }
    });
  });

  projects.forEach((project) => {
    createPage({
      path: project.node.fields.slug,
      component: projectTemplate,
      context: {
        id: project.node.id,
        nameRegex: `/${project.node.frontmatter.name}/`
      }
    });
  });
};
