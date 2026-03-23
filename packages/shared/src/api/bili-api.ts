import { type } from 'arktype';
import ky from 'ky';

export interface BiliResponse<T> {
  /** -101 未登录 */
  code: number;
  data: T;
  message: string;
  ttl: number;
}

export interface DanmuHostServer {
  host: string;
  port: number;
  wss_port: number;
  ws_port: number;
}

export interface DanmuServer {
  host: string;
  port: number;
}

export type DanmuConf = {
  refresh_row_factor: number;
  refresh_rate: number;
  max_delay: number;
  port: number;
  host: string;
  host_server_list: DanmuHostServer[];
  server_list: DanmuServer[];
  token: string;
};

export type FetchDanmuConfResp = BiliResponse<DanmuConf>;

// bili nav 接口返回的用户信息
export interface BiliNav {
  isLogin: boolean;
  email_verified: number;
  uname: string;
  face: string;
  face_nft: number;
  face_nft_type: number;
  level_info: {
    current_level: number;
    current_min: number;
    current_exp: number;
    next_exp: string;
  };
  mid: number;
  mobile_verified: number;
  money: number;
  moral: number;
  official: {
    role: number;
    title: string;
    desc: string;
    type: number;
  };
  officialVerify: {
    type: number;
    desc: string;
  };
  pendant: {
    pid: number;
    name: string;
    image: string;
    expire: number;
    image_enhance: string;
    image_enhance_frame: string;
    n_pid: number;
  };
  scores: number;
  vipDueDate: number;
  vipStatus: number;
  vipType: number;
  vip_pay_type: number;
  vip_theme_type: number;
  vip_label: {
    path: string;
    text: string;
    label_theme: string;
    text_color: string;
    bg_style: number;
    bg_color: string;
    border_color: string;
    use_img_label: boolean;
    img_label_uri_hans: string;
    img_label_uri_hant: string;
    img_label_uri_hans_static: string;
    img_label_uri_hant_static: string;
    label_id: number;
    label_goto: {
      mobile: string;
      pc_web: string;
    };
  };
  vip_avatar_subscript: number;
  vip_nickname_color: string;
  wallet: {
    mid: number;
    bcoin_balance: number;
    coupon_balance: number;
    coupon_due_time: number;
  };
  has_shop: boolean;
  shop_url: string;
  answer_status: number;
  is_senior_member: number;
  wbi_img: {
    img_url: string;
    sub_url: string;
  };
  is_jury: boolean;
  name_render: unknown | null;
}

export type FetchBiliNavResp = BiliResponse<BiliNav>;

export async function fetchDanmuInfo(roomId: number, cookie?: string | null) {
  const res = await ky
    .get<FetchDanmuConfResp>(
      `https://api.live.bilibili.com/room/v1/Danmu/getConf?room_id=${roomId}`,
      {
        credentials: 'include',
        headers: {
          Cookie: cookie ?? '',
        },
      },
    )
    .json();

  if (res.code !== 0) throw new Error(res.message);

  const randomServer =
    res.data.server_list[Math.floor(Math.random() * res.data.server_list.length)];

  return {
    ...res.data,
    randomServer,
  };
}

export async function fetchNavInfo(cookie: string | null) {
  const res = await ky<FetchBiliNavResp>('https://api.bilibili.com/x/web-interface/nav', {
    credentials: 'include',
    headers: { Cookie: cookie ?? '' },
  }).json();

  if (res.code === 0) return res.data;
  if (res.code === -101) return { mid: 0 };

  throw new Error(res.message);
}

const SSRRoomInfoSchema = type({
  roomInitRes: type({
    code: type('0'),
    data: type({
      uid: 'number',
      room_id: 'number',
      short_id: 'number',
      live_status: 'number',
    }),
  }),
  roomInfoRes: type({
    code: type('0'),
    data: type({
      room_info: type({
        uid: 'number',
        room_id: 'number',
        short_id: 'number',
        title: 'string',
        cover: 'string',
        tags: 'string',
      }),
      anchor_info: type({
        base_info: type({
          uname: 'string',
          face: 'string',
        }),
        medal_info: type({
          medal_name: 'string?',
        }).optional(),
        news_info: type({
          content: 'string?',
        }).optional(),
      }),
    }),
  }),
});

/**
 * 通过 RoomId 获取直播间信息（支持短直播间号）
 */
export async function fetchRoomInfo(roomId: string | number) {
  const res = await ky
    .get(`https://live.bilibili.com/blanc/${roomId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    .text();

  // 匹配 window.__NEPTUNE_IS_MY_WAIFU__= 后面直到第一个 </script> 前的内容
  const scriptContent = res.match(/window\.__NEPTUNE_IS_MY_WAIFU__\s*=[\s\S]*?(?=<\/script>)/)?.[0];

  let jsonStr = scriptContent
    ?.replace(/^window\.__NEPTUNE_IS_MY_WAIFU__\s*=\s*/, '') // 去掉变量名和等号
    .replace(/;?$/, '') // 去掉末尾的分号
    .trim();

  const data = SSRRoomInfoSchema(jsonStr ? JSON.parse(jsonStr) : {});

  if (data instanceof type.errors) return;

  return {
    ...data.roomInitRes.data,
    ...data.roomInfoRes.data.room_info,
    ...data.roomInfoRes.data.anchor_info.base_info,
    ...data.roomInfoRes.data.anchor_info,
  };
}
