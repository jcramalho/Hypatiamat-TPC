"use strict";

const _ = require("lodash");

module.exports = async (ctx, next) => {
  let role;

  const advanced = await strapi
    .store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
      key: "advanced",
    })
    .get();

  if (ctx.state.user) {
    // request is already authenticated in a different way
    return next();
  }

  if (
    ctx.request &&
    ctx.request.header &&
    ctx.request.header.authorization &&
    ctx.request.header.usertype
  ) {
    try {
      console.log(ctx);
      const { id } = await strapi.plugins[
        "users-permissions"
      ].services.jwt.getToken(ctx);

      if (id === undefined) {
        throw new Error("Invalid token: Token did not contain required fields");
      }

      // fetch authenticated user
      const userType = ctx.request.header.usertype;
      if (userType === "aluno") {
        ctx.state.user = await strapi.services.aluno.fetchAuthenticatedUser(id);
      } else {
        ctx.state.user = await strapi.services.professor.fetchAuthenticatedUser(
          id
        );
      }
    } catch (err) {
      return handleErrors(ctx, err, "unauthorized");
    }

    if (!ctx.state.user) {
      return handleErrors(ctx, "User Not Found", "unauthorized");
    }

    role = ctx.state.user.role;

    if (!role) {
      const defaultRole = await strapi
        .query("role", "users-permissions")
        .findOne({ type: advanced.default_role }, []);
      ctx.state.user.role = defaultRole;
      role = ctx.state.user.role;
    }

    console.log(ctx.state.user);

    if (role.type === "root") {
      return await next();
    }

    const store = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    if (
      _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
      !ctx.state.user.confirmed
    ) {
      return handleErrors(
        ctx,
        "Your account email is not confirmed.",
        "unauthorized"
      );
    }

    if (ctx.state.user.blocked) {
      return handleErrors(
        ctx,
        "Your account has been blocked by the administrator.",
        "unauthorized"
      );
    }
  }

  // Retrieve `public` role.
  if (!role) {
    role = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" }, []);
  }

  const route = ctx.request.route;
  const permission = await strapi
    .query("permission", "users-permissions")
    .findOne(
      {
        role: role.id,
        type: route.plugin || "application",
        controller: route.controller,
        action: route.action,
        enabled: true,
      },
      []
    );

  if (!permission) {
    return handleErrors(ctx, undefined, "forbidden");
  }

  // Execute the policies.
  if (permission.policy) {
    return await strapi.plugins["users-permissions"].config.policies[
      permission.policy
    ](ctx, next);
  }

  // Execute the action.
  await next();
};

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
