'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

create: async ctx => {
    const {id} = ctx.state.user;

    const depositObj = {
        ...ctx.request.body,
        depositor: id,
    };

    const data = await strapi.services.deposit.add(depositObj);

    ctx.created(data);
}

module.exports = {

    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          data.user = ctx.state.user.id;
          entity = await strapi.services.post.create({...data, likes: 0}, { files });
        } else {
          ctx.request.body.user = ctx.state.user.id;
          entity = await strapi.services.post.create({...ctx.request.body, likes:0});
        }
        return sanitizeEntity(entity, { model: strapi.models.post });
      },
      async delete(ctx) {
        const { id } = ctx.params;
    
        let entity;
    
        const [post] = await strapi.services.post.find({
          id: ctx.params.id,
          'user.id': ctx.state.user.id,
        });
    
        if (!post) {
          return ctx.unauthorized(`You can't delete this entry`);
        }
    
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services.post.delete({ id }, data, {
            files,
          });
        } else {
          entity = await strapi.services.post.delete({ id }, ctx.request.body);
        }
    
        return sanitizeEntity(entity, { model: strapi.models.post });
      },
    };
