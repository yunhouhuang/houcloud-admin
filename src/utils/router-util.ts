// @ts-ignore
const viewModules = import.meta.glob('../pages/**/*.vue');
// @ts-ignore
const layoutModules = import.meta.glob('../layouts/*.vue');

function dynamicImport(dynamicViewsModules, component) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../', '');
    return k === component;
  });
  const matchKey = matchKeys[0];

  return dynamicViewsModules[matchKey];
}

export const asyncRouterHandle = (asyncRouter) => {
  asyncRouter.forEach((item) => {
    if (item.component) {
      if (typeof item.component !== 'string') {
        console.log(item.name);
        return;
      }
      if (item.component.split('/')[0] === 'pages') {
        item.component = dynamicImport(viewModules, item.component);
      } else if (item.component.split('/')[0] === 'layouts') {
        // console.log(item.name);
        item.component = dynamicImport(layoutModules, item.component);
      }
    } else {
      delete item.component;
    }
    if (item.children) {
      asyncRouterHandle(item.children);
    }
  });
};
