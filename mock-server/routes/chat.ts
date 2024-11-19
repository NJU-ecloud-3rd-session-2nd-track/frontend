import { Message } from "ai";

type MockMessage = Message & {
  annotations: (
    | {
        type: "suggested_questions";
        data: string[];
      }
    | {
        type: "sources";
        data: {
          nodes: {
            metadata: {
              file_name: string;
            };
            url: string;
          }[];
        };
      }
  )[];
};

export const mockAssistantMessage: MockMessage = {
  id: "SJH47Mi",
  content:
    '"王亚平，女，1980年1月出生于山东省烟台市，1997年8月加入中国人民解放军，2001年5月成为中国共产党党员。她毕业于空军长春飞行学院，是中国人民解放军航天员大队二级航天员，副师职航天员，拥有丰富的航天经验。\n' +
    "\n" +
    "2013年，王亚平与聂海胜、张晓光一起乘坐神舟十号飞船执行太空任务，成为中国第二位进行太空行走的女航天员。在这次任务中，她还为中国的孩子们进行了首次太空授课，展示了失重环境下的物理现象，激发了青少年对太空科学的兴趣。2021年，王亚平再次作为乘组成员参与神舟十三号任务，飞往中国空间站。这次任务中，她不仅成为中国首位进驻空间站的女航天员，还成为中国首位出舱的女航天员，同时也是首位在太空进行第二次授课的中国航天员。\n" +
    "\n" +
    '在完成了神舟十三号任务之后，王亚平继续投入常态化的训练当中，保持良好的身体和心理状态，随时准备迎接新的太空挑战。她表达了对重返太空及实现月球漫步的渴望，这体现了她对航天事业的热爱和对太空探索的追求。王亚平的梦想是重返太空，将来有机会实现月球漫步，她的故事激励着无数人追求自己的太空梦想。"',
  role: "assistant",
  annotations: [
    {
      type: "suggested_questions",
      data: [
        "Suggested question 0",
        "Suggested question 1",
        "Suggested question 2",
      ],
    },
    {
      type: "sources",
      data: {
        nodes: [
          {
            url: "http://localhost:23333/api/files/data/7c37bff419d6fe03eb2b183129b095c8",
            metadata: {
              file_name: "逐梦苍穹、揽月九天 中国探月工程“进度表”被“剧透”",
            },
          },
          {
            url: "http://localhost:23333/api/files/data/f5330751d4d66f613e880a836231f641",
            metadata: {
              file_name:
                "代表委员这一天丨王亚平：致力于航天事业和科普教育 希望实现月球漫步",
            },
          },
        ],
      },
    },
  ],
};
