/**
 * @Sub-Store-Page
 * 节点名添加前缀
 *
 * 在指定的条件下为节点添加前缀
 */

const SUB_STORE_SCHEMA = {
  title: "Add Prefix",
  scope: ["Node", "Surge", "QX", "Loon", "Stash", "ShadowRocket"],
  description: "须在在单条订阅中使用，在指定条件下为每个节点添加前缀",
  author: "Lee",
  version: "0.0.1",
  updateTime: "2023-10-08",
  params: {
    condition: {
      name: "添加条件",
      description: "添加节点前缀的条件",
      dataType: "select",
      defaultValue: "collection_only",
      options: [
        {
          label: "当单独订阅时添加",
          value: "sub_only",
        },
        {
          label: "当被组合订阅时添加",
          value: "collection_only",
        },
        {
          label: "总是添加",
          value: "always",
        },
      ],
    },
    prefix: {
      name: "前缀内容",
      description: "节点前缀字符串，留空则默认为单条订阅的名称",
      dataType: "string",
      defaultValue: "",
    },
    add_space: {
      name: "是否添加间隔",
      description: "节点前缀字符串，留空则默认为单条订阅的名称",
      dataType: "boolean",
      defaultValue: true,
    },
  },
};

function operator(proxies = [], targetPlatform, env) {
  const _ = lodash;

  const { source } = env;
  const isCollection = !!source?._collection?.name;

  const condition = _.get($arguments, "condition");
  const add_space = _.get($arguments, "add_space");
  const prefix = _.get($arguments, "prefix");

  const needAddPrefix =
    condition === "always" ||
    (condition === "sub_only" && !isCollection) ||
    (condition === "collection_only" && isCollection);

  return proxies.map((p) => {
    if (needAddPrefix) {
      const { subName } = p;
      const prefixStr =
        prefix || source[subName]?.displayName || source[subName]?.name || "";

      if (prefixStr) {
        const space = add_space ? " " : "";
        p.name = prefixStr + space + p.name;
      }
    }
    return p;
  });
}
