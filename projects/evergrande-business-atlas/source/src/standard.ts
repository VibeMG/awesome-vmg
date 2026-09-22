import type { VmgStandardEditorSchema } from '@base_bit/vmg-sdk';
export const standardSchema = {
  "title": "恒大集团 · 历史业务版图",
  "description": "镜头参数支持关键帧；产业卡片可分别改文字、素材与位置。",
  "groups": [
    {
      "id": "labels",
      "label": "标题与时期",
      "defaultOpen": true,
      "controls": [
        {
          "id": "heading",
          "label": "标题",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.heading"
          },
          "control": "text"
        },
        {
          "id": "period",
          "label": "年份口径",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.period"
          },
          "control": "text"
        },
        {
          "id": "footer-brand",
          "label": "页脚品牌",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.footerBrand"
          },
          "control": "text"
        },
        {
          "id": "footer-year",
          "label": "页脚年份",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.footerYear"
          },
          "control": "text"
        },
        {
          "id": "source-note",
          "label": "资料口径说明",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.note"
          },
          "control": "text"
        }
      ]
    },
    {
      "id": "camera",
      "label": "3D 摄像机",
      "defaultOpen": false,
      "columns": 2,
      "controls": [
        {
          "id": "cam-cameraX",
          "label": "目标 X",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.cameraX"
          },
          "control": "number"
        },
        {
          "id": "cam-cameraY",
          "label": "目标 Y",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.cameraY"
          },
          "control": "number"
        },
        {
          "id": "cam-distance",
          "label": "镜头距离",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.distance"
          },
          "control": "number"
        },
        {
          "id": "cam-yaw",
          "label": "水平环绕",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.yaw"
          },
          "control": "number"
        },
        {
          "id": "cam-pitch",
          "label": "俯仰",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.pitch"
          },
          "control": "number"
        },
        {
          "id": "cam-roll",
          "label": "滚转",
          "type": "field",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.roll"
          },
          "control": "number"
        }
      ],
      "proTargets": [
        {
          "label": "编辑摄影机关键帧",
          "binding": {
            "nodeId": "camera-3d",
            "propertyPath": "props.data.cameraX"
          }
        }
      ]
    },
    {
      "id": "platforms",
      "label": "产业平台",
      "controls": [],
      "groups": [
        {
          "id": "edit-group",
          "label": "恒大集团",
          "defaultOpen": false,
          "controls": [
            {
              "id": "group-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "group-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "group-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "group-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "group-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "group-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "group-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "group-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            },
            {
              "id": "group-year",
              "label": "年份标签",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.yearLabel"
              },
              "control": "text"
            },
            {
              "id": "group-year-caption",
              "label": "年份说明",
              "type": "field",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.yearCaption"
              },
              "control": "text"
            },
            {
              "id": "group-logo",
              "label": "集团标志",
              "type": "asset",
              "binding": {
                "nodeId": "group",
                "propertyPath": "props.data.logo"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-estate",
          "label": "恒大地产",
          "defaultOpen": false,
          "controls": [
            {
              "id": "estate-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "estate-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "estate-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "estate-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "estate-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "estate-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "estate-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "estate-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "estate",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-property",
          "label": "恒大物业",
          "defaultOpen": false,
          "controls": [
            {
              "id": "property-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "property-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "property-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "property-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "property-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "property-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "property-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "property",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "property-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "property",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-auto",
          "label": "恒大汽车",
          "defaultOpen": false,
          "controls": [
            {
              "id": "auto-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "auto-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "auto-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "auto-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "auto-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "auto-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "auto-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "auto-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "auto",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-tourism",
          "label": "恒大童世界",
          "defaultOpen": false,
          "controls": [
            {
              "id": "tourism-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "tourism-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "tourism-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "tourism-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "tourism-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "tourism-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "tourism-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "tourism-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "tourism",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-network",
          "label": "恒腾网络",
          "defaultOpen": false,
          "controls": [
            {
              "id": "network-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "network-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "network-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "network-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "network-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "network-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "network-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "network",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "network-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "network",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-fcb",
          "label": "房车宝",
          "defaultOpen": false,
          "controls": [
            {
              "id": "fcb-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "fcb-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "fcb-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "fcb-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "fcb-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "fcb-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "fcb-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "fcb-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "fcb",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-health",
          "label": "大健康产业",
          "defaultOpen": false,
          "controls": [
            {
              "id": "health-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "health-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "health-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "health-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "health-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "health-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "health-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "health",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "health-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "health",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        },
        {
          "id": "edit-water",
          "label": "恒大冰泉",
          "defaultOpen": false,
          "controls": [
            {
              "id": "water-title",
              "label": "中文名称",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "props.data.title"
              },
              "control": "text"
            },
            {
              "id": "water-english",
              "label": "英文名称",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "props.data.english"
              },
              "control": "text"
            },
            {
              "id": "water-detail",
              "label": "业务说明",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "props.data.detail"
              },
              "control": "text"
            },
            {
              "id": "water-badge",
              "label": "注记",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "props.data.badge"
              },
              "control": "text"
            },
            {
              "id": "water-x",
              "label": "空间 X",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "transform.x"
              },
              "control": "number"
            },
            {
              "id": "water-y",
              "label": "空间 Y",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "transform.y"
              },
              "control": "number"
            },
            {
              "id": "water-z",
              "label": "空间 Z",
              "type": "field",
              "binding": {
                "nodeId": "water",
                "propertyPath": "props.data.depth"
              },
              "control": "number"
            },
            {
              "id": "water-image",
              "label": "图片素材",
              "type": "asset",
              "binding": {
                "nodeId": "water",
                "propertyPath": "props.data.image"
              },
              "accept": [
                "image"
              ]
            }
          ]
        }
      ],
      "groupPicker": "选择平台"
    },
    {
      "id": "captions",
      "label": "解说字幕",
      "defaultOpen": false,
      "controls": [
        {
          "id": "subtitle-1",
          "label": "字幕 1",
          "type": "field",
          "binding": {
            "nodeId": "caption-1",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        },
        {
          "id": "subtitle-2",
          "label": "字幕 2",
          "type": "field",
          "binding": {
            "nodeId": "caption-2",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        },
        {
          "id": "subtitle-3",
          "label": "字幕 3",
          "type": "field",
          "binding": {
            "nodeId": "caption-3",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        },
        {
          "id": "subtitle-4",
          "label": "字幕 4",
          "type": "field",
          "binding": {
            "nodeId": "caption-4",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        },
        {
          "id": "subtitle-5",
          "label": "字幕 5",
          "type": "field",
          "binding": {
            "nodeId": "caption-5",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        },
        {
          "id": "subtitle-6",
          "label": "字幕 6",
          "type": "field",
          "binding": {
            "nodeId": "caption-6",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        },
        {
          "id": "subtitle-7",
          "label": "字幕 7",
          "type": "field",
          "binding": {
            "nodeId": "caption-7",
            "propertyPath": "props.data.text"
          },
          "control": "text"
        }
      ]
    }
  ]
} satisfies VmgStandardEditorSchema;
