/**
 * ANDROID SHELF — an allow-list, not a column.
 *
 * Why this file exists
 * --------------------
 * The Desk's work order of 2026-10-05 (21:30 AST) replaces the Android shelf:
 * thirty official news lives instead of eight, and a colour on-demand shelf
 * instead of the eight Archive scans from 1906-1964 that used to be there.
 *
 * The eight lives stay exactly as they were. Everything else here is new, and
 * every row in this file was checked against the source before it was written:
 *
 *   LIVE  The broadcaster's own YouTube channel, found from its channel page
 *         (vanityChannelUrl) and then proved by fetching that handle and reading
 *         the canonical URL back — it must name the same channel id. The stream
 *         is the CHANNEL form, `youtube.com/embed/live_stream?channel=UC...`,
 *         never a video id: a 24/7 news channel restarts its broadcast and a
 *         stored video id would die with it. Liveness was read from
 *         `youtube.com/channel/<id>/live` at 2026-10-05 (isLive:true plus the
 *         live stream's own title). That is a machine reading of the page, not
 *         an eyeball on a picture — the founder's emulator pass is what puts
 *         eyes on it, and a channel that is dark then comes off this list.
 *   FILM  The Archive item must declare the licence we ship it under (the item's
 *         own licenseurl / rights field), the item must declare the picture is
 *         colour, and the poster pixels must actually measure colour. Year is
 *         the item's year; the shelf is ordered newest first.
 *
 * Why an allow-list rather than `clearedForApp: true`
 * ---------------------------------------------------
 * The same reason src/lib/store-ios-live.ts is one: a flag is a switch a script
 * can flip, and a lifted flag on the wrong row ships a channel we never opened.
 * A row reaches the Android shelf only by being written into this file, and this
 * file is reviewed. It also means the Android shelf and the website catalogue
 * cannot move each other: the website keeps every harvested row it has, the
 * app carries what is listed here.
 *
 * Nothing in this file touches iOS. `isIosStore` routes never import it; the
 * Apple binary stays eight live and zero on-demand.
 */

import { prisma } from "@/lib/prisma";

/** The one shelf label the Android store shows on demand. No count, no "Free". */
export const ANDROID_SHELF_LABEL = "Public Domain & CC";

/** A live row exactly as /api/mobile/v1/live returns it. */
export type AndroidLiveRow = {
  id: string;
  name: string;
  logoUrl: string;
  streamUrl: string;
  country: string;
  language: string;
  category: string;
  isHD: boolean;
  isActive: boolean;
  rightsBasis: string;
  evidenceUrl: string;
};

type AndroidLiveEntry = {
  /** The id the app already uses for this channel: its catalogue row id, or
   *  `yt-<channelId>` when the catalogue has no row for the broadcaster. */
  id: string;
  name: string;
  /** The broadcaster's own YouTube channel. */
  channelId: string;
  /** The channel page shown to a reviewer as evidenceUrl. */
  handle: string;
  logoUrl: string;
  country: string;
  language: string;
};

/** Why we may carry a broadcaster's live stream. Unchanged from the eight rows
 *  that already ship: we embed the broadcaster's own player and host nothing. */
const RIGHTS_LIVE =
  "Official broadcaster live stream, published by the broadcaster on its own YouTube channel and played through YouTube's embeddable player. No hosting, copying or re-encoding by us.";

/**
 * THE SHELF. Order is deliberate and stable: the eight that already ship first
 * (untouched, same ids, same stream URLs, same evidence URLs), then the Arabic
 * row, then South Asia, South-East Asia, Europe and Africa.
 */
export const ANDROID_LIVE: AndroidLiveEntry[] = [
  {
    id: "cmu4il9zu0005uk1wgh6kiq99",
    name: "ABC News (Australia)",
    channelId: "UCVgO39Bk5sMo66-6o6Spn6Q",
    handle: "https://www.youtube.com/@abcnewsaustralia",
    logoUrl: "https://yt3.googleusercontent.com/sc9xa2bYk6pIuKX3qgMHSrxEkuPmg57JMl_lRaJqCZxuSIeQt1B6BV23c-16Q3b7Aep0on1b=s900-c-k-c0x00ffffff-no-rj",
    country: "Australia",
    language: "English",
  },
  {
    id: "cmu4il8rj0004uk1wzx38yigs",
    name: "Africanews",
    channelId: "UC1_E8NeF5QHY2dtdLRBCCLA",
    handle: "https://www.youtube.com/@africanews",
    logoUrl: "https://yt3.googleusercontent.com/supFnsx-hsuLdP_Dvj4uJoT_LpvM5_9ctZRwZ_IdiI5GbVjI1BjXhEToXMuxRCmPKXmh44iQnA=s900-c-k-c0x00ffffff-no-rj",
    country: "Pan-African",
    language: "English",
  },
  {
    id: "cmu4il4n80001uk1wnn6zewgy",
    name: "Al Jazeera English",
    channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg",
    handle: "https://www.youtube.com/@aljazeeraenglish",
    logoUrl: "https://yt3.googleusercontent.com/XsTga3Nsfc1E6ZgC6HfHfzTG_3zhuZleOnsKxSK2aILMjwkkIm-0vdALFaU-yt0Lw07iLtbSifk=s900-c-k-c0x00ffffff-no-rj",
    country: "Qatar",
    language: "English",
  },
  {
    id: "cmu4il6gd0002uk1wljpkyk8b",
    name: "CNA",
    channelId: "UC83jt4dlz1Gjl58fzQrrKZg",
    handle: "https://www.youtube.com/@channelnewsasia",
    logoUrl: "https://yt3.googleusercontent.com/ytc/AIdro_n00DzE39o-4IFJ07IP3gG__TMqKxXXbwYaARinwTXTDFM=s900-c-k-c0x00ffffff-no-rj",
    country: "Singapore",
    language: "English",
  },
  {
    id: "cmu4b0hup000111a1qeev0ylr",
    name: "DW English",
    channelId: "UCknLrEdhRCp1aegoMqRaCZg",
    handle: "https://www.youtube.com/@dwnews",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2VjNDg5OSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MDA3MjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2cpIi8+CiAgCiAgPHRleHQgeD0iNTAlIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIG9wYWNpdHk9IjAuOTIiPkRXIEVuZ2xpc2g8L3RleHQ+CiAgCjwvc3ZnPg==",
    country: "Germany",
    language: "English",
  },
  {
    id: "cmu4b0gpy000011a19c6r66q0",
    name: "France 24 English",
    channelId: "UCQfwfsi5VrQ8yKZ-UWmAEFg",
    handle: "https://www.youtube.com/@France24_en",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2VjNDg5OSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MDA3MjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2cpIi8+CiAgCiAgPHRleHQgeD0iNTAlIiB5PSI4MC41IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzMiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBvcGFjaXR5PSIwLjkyIj5GcmFuY2UgMjQ8L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iMTE5LjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIG9wYWNpdHk9IjAuOTIiPkVuZ2xpc2g8L3RleHQ+CiAgCjwvc3ZnPg==",
    country: "France",
    language: "English",
  },
  {
    id: "cmu4il7p80003uk1w5d99qxfq",
    name: "NHK WORLD-JAPAN",
    channelId: "UCSPEjw8F2nQDtmUKPFNF7_A",
    handle: "https://www.youtube.com/@NHKWORLDJAPAN",
    logoUrl: "https://yt3.googleusercontent.com/ytc/AIdro_m9YDtPWqgZW91_-QTdsVWLbnR0ZQ1BaHX38ZcSRVGnfd0=s900-c-k-c0x00ffffff-no-rj",
    country: "Japan",
    language: "English",
  },
  {
    id: "cmu4il3780000uk1wfqypyaqw",
    name: "TRT World",
    channelId: "UC7fWeaHhqgM4Ry-RMpM2YYw",
    handle: "https://www.youtube.com/@trtworld",
    logoUrl: "https://yt3.googleusercontent.com/luLQWmGFG4iDC1U_2JlzZ1mquci_sUdfZfFl4eWgBkDpW6tvZT0MEA4c4JebJdi9hCo518q1=s900-c-k-c0x00ffffff-no-rj",
    country: "Turkey",
    language: "English",
  },
  {
    id: "cmsor42mf0002nn71ure36t1f",
    name: "France 24 Arabic",
    channelId: "UCdTyuXgmJkG_O8_75eqej-w",
    handle: "https://www.youtube.com/@France24_ar",
    logoUrl: "https://yt3.ggpht.com/ttCZI4HzbwlKBLe-hgRNy8N3QyymY4FOqb3Todsh0ic8Ms-8SbZ9cN0IQZhTEiINQMQtIXef=s900-c-k-c0x00ffffff-no-rj",
    country: "France",
    language: "Arabic",
  },
  {
    id: "cmsor42mf000wnn71bmtdjdru",
    name: "Al Jazeera Arabic",
    channelId: "UCfiwzLy-8yKzIbsmZTzxDgw",
    handle: "https://www.youtube.com/@aljazeera",
    logoUrl: "https://yt3.googleusercontent.com/oN_i26ADOuQ4PdypHo8yjVXh6QSXZ1kMeYzaRH3hNOlQE1uEUUQ-gkCh0o1rUQ2PM7Qx6QvY2g=s900-c-k-c0x00ffffff-no-rj",
    country: "Qatar",
    language: "Arabic",
  },
  {
    id: "cmsor42mf0008nn71olubs22q",
    name: "Al Arabiya",
    channelId: "UCahpxixMCwoANAftn6IxkTg",
    handle: "https://www.youtube.com/@AlArabiya",
    logoUrl: "https://yt3.googleusercontent.com/GoZXY6BOD_V0vV3ok3fAzIbNMx3og4z2Jd2Up0BnocvBn35rMB4NG3vMOdzOpQ4-HFBUfDQ-JQ=s900-c-k-c0x00ffffff-no-rj",
    country: "United Arab Emirates",
    language: "Arabic",
  },
  {
    id: "yt-UC5GvVahlgulCyo4cshSmbcg",
    name: "TRT Arabi",
    channelId: "UC5GvVahlgulCyo4cshSmbcg",
    handle: "https://www.youtube.com/@TRTArabi",
    logoUrl: "https://yt3.googleusercontent.com/gYgMDstQrKquZlKMpynGak3fik58-0UdhvIFvRNk8Z1KAGDzn6Kuz8uULtWRwVM3bJcqBuWfxQ=s900-c-k-c0x00ffffff-no-rj",
    country: "Turkey",
    language: "Arabic",
  },
  {
    id: "cmsor42mm00e7nn71p24aui9q",
    name: "Somoy TV",
    channelId: "UCxHoBXkY88Tb8z1Ssj6CWsQ",
    handle: "https://www.youtube.com/@somoynews360",
    logoUrl: "https://yt3.googleusercontent.com/HIVp56M09fDcVPKGpRXkl47xJcG7JGV5Mwn8E_7TlwmPgjgg1MQ7t_oxiy4xkmgo5fmWxilY3yU=s900-c-k-c0x00ffffff-no-rj",
    country: "Bangladesh",
    language: "Bengali",
  },
  {
    id: "cmsor42mm00e8nn715i71q5pm",
    name: "Ekattor TV",
    channelId: "UCtqvtAVmad5zywaziN6CbfA",
    handle: "https://www.youtube.com/@EkattorTelevision",
    logoUrl: "https://yt3.googleusercontent.com/M8Rqad6_uN86mMSvd9KGkE5G2mrVAgvfTV-VCsQb6jhfF5hEbcQCEJiInih4wb2fMQ_RG7Ku=s900-c-k-c0x00ffffff-no-rj",
    country: "Bangladesh",
    language: "Bengali",
  },
  {
    id: "cmsor42mm00e9nn71yfgdqfw4",
    name: "Jamuna TV",
    channelId: "UCN6sm8iHiPd0cnoUardDAnw",
    handle: "https://www.youtube.com/@JamunaTVbd",
    logoUrl: "https://yt3.googleusercontent.com/54prTx28YpPxSpk_PfJGuOfQgcZbNdvbfk0adGePrAvINO4Mo9_bw3j-J4seXn6hNGuMr1ck=s900-c-k-c0x00ffffff-no-rj",
    country: "Bangladesh",
    language: "Bengali",
  },
  {
    id: "cmsor42mi007tnn71sfx4wbc6",
    name: "TV9 Bangla",
    channelId: "UCHCR4UFsGwd_VcDa0-a4haw",
    handle: "https://www.youtube.com/@TV9BanglaLive",
    logoUrl: "https://yt3.googleusercontent.com/d8QNkJ7Jby9hVSTm67-E4nfbI-7CTgP262NPVGfYpoTZaxLw7uAOPxs5dJtARjEFQijsRsuiFQ=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "Bengali",
  },
  {
    id: "yt-UCttspZesZIDEwwpVIgoZtWQ",
    name: "India TV",
    channelId: "UCttspZesZIDEwwpVIgoZtWQ",
    handle: "https://www.youtube.com/@indiatv",
    logoUrl: "https://yt3.googleusercontent.com/8VL4gMfdN2DAnnsyEHUkwxjzIIAs5DcoTeYRQLvS3ExNPu1Op0YsdhY9664A-FXNGScHRKoe=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "Hindi",
  },
  {
    id: "cmsor42mg0028nn718ht6eaiv",
    name: "India Today",
    channelId: "UCYPvAwZP8pZhSMW8qs7cVCw",
    handle: "https://www.youtube.com/@indiatoday",
    logoUrl: "https://yt3.googleusercontent.com/zmdnM_PEm9R4tR4FL4n2GdTZ3vxFFMTUuxl4Tkw18Okng69ik68jGaoFJnYqdVYlDgJHVr7G9w=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "Hindi",
  },
  {
    id: "cmsor42mg0026nn713bzd2067",
    name: "NDTV",
    channelId: "UCZFMm1mMw0F81Z37aaEzTUA",
    handle: "https://www.youtube.com/@NDTV",
    logoUrl: "https://yt3.googleusercontent.com/mOb3OXPZO0-7LmZ0Y4o_wz2imPJ7aFa_isYXg0awkLyL1ehglmsiQD4rWxwrUrfXLK9jlh35=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "English",
  },
  {
    id: "yt-UC_gUM8rL-Lrg6O3adPW9K1g",
    name: "WION",
    channelId: "UC_gUM8rL-Lrg6O3adPW9K1g",
    handle: "https://www.youtube.com/@WION",
    logoUrl: "https://yt3.googleusercontent.com/evxeFzRem76hjPRh_S_B5MvjNhl4yKjSrIzmvwFx3nyEWHBOPHA4jTum6Yys3HRR0IvYmWud=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "English",
  },
  {
    id: "cmsor42mi006ann71vohrim4a",
    name: "Asianet News",
    channelId: "UCf8w5m0YsRa8MHQ5bwSGmbw",
    handle: "https://www.youtube.com/@asianetnews",
    logoUrl: "https://yt3.googleusercontent.com/8eItmjbOfJwot8wd0-19KgtvF2ztf4np2qIVfJ1kMPv1ADi6wx9giU62B1j6xO0Ug2Idrqbncg=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "Malayalam",
  },
  {
    id: "yt-UC-JFyL0zDFOsPMpuWu39rPA",
    name: "Thanthi TV",
    channelId: "UC-JFyL0zDFOsPMpuWu39rPA",
    handle: "https://www.youtube.com/@thanthitv",
    logoUrl: "https://yt3.googleusercontent.com/w-7UMZzfXHJC7JM7jDfL362GkzmLn8UmQTCFjqMvztgN9FaBoTw_nPpZRSkFQBTFk8a_QeYu=s900-c-k-c0x00ffffff-no-rj",
    country: "India",
    language: "Tamil",
  },
  {
    id: "cmsor42mm00ebnn71n89ja3h0",
    name: "GMA News",
    channelId: "UCqYw-CTd1dU2yGI71sEyqNw",
    handle: "https://www.youtube.com/@gmanews",
    logoUrl: "https://yt3.googleusercontent.com/Gwe8ZHt5B2ZxijlgvtnALf1BPpzJQg8bK-IyB1iwe_OZEHy8Hwh0Q-FrRM5G46S132a451g3Cw=s900-c-k-c0x00ffffff-no-rj",
    country: "Philippines",
    language: "Filipino",
  },
  {
    id: "cmsor42mm00ecnn71se65bkkt",
    name: "UNTV",
    channelId: "UC3XaG-7UVi2vD8ZZEMNnnpw",
    handle: "https://www.youtube.com/@UNTVNewsandRescue",
    logoUrl: "https://yt3.googleusercontent.com/Fvfybbje_xykZaCwPjB2yxDRiy93Szq7mHwM1Yk3hIHtoFMcPYbE68S6DdyzCSj4dXQcnKoZfg=s900-c-k-c0x00ffffff-no-rj",
    country: "Philippines",
    language: "Filipino",
  },
  {
    id: "yt-UCSrZ3UV4jOidv8ppoVuvW9Q",
    name: "Euronews",
    channelId: "UCSrZ3UV4jOidv8ppoVuvW9Q",
    handle: "https://www.youtube.com/@euronews",
    logoUrl: "https://yt3.googleusercontent.com/8MyE7rxMBfLZOpYkJVJFm1C8I9jxbceBbOJS9OhrepZMVGxGV-OEJU-UdLOew_qR_l-knETWeu4=s900-c-k-c0x00ffffff-no-rj",
    country: "Europe",
    language: "English",
  },
  {
    id: "cmsor42mf0003nn71r98gsm6j",
    name: "France 24 French",
    channelId: "UCCCPCZNChQdGa9EkATeye4g",
    handle: "https://www.youtube.com/@FRANCE24",
    logoUrl: "https://yt3.googleusercontent.com/ytc/AIdro_k9aU_SRhYAWJjQ6AO7uzQDZE5mb7gmv4synLrC7hEWGjE=s900-c-k-c0x00ffffff-no-rj",
    country: "France",
    language: "French",
  },
  {
    id: "yt-UC5BMIWZe9isJXLZZWPWvBlg",
    name: "Kompas TV",
    channelId: "UC5BMIWZe9isJXLZZWPWvBlg",
    handle: "https://www.youtube.com/@kompastv",
    logoUrl: "https://yt3.googleusercontent.com/zjKbjnC7zktWR7pw8AeuvW0Br9Xsk-MPW8JiVgKlF1K4vxiieEOqTk9WqrX1aDYScMoDDUmNDQ=s900-c-k-c0x00ffffff-no-rj",
    country: "Indonesia",
    language: "Indonesian",
  },
  {
    id: "yt-UC8lKgUHo-2mSR5cRRXO9xow",
    name: "Siyatha News",
    channelId: "UC8lKgUHo-2mSR5cRRXO9xow",
    handle: "https://www.youtube.com/@SiyathaNews",
    logoUrl: "https://yt3.googleusercontent.com/nlV4tpla_16qyXzv5rZ6c1hslJsLQeHGOURC1ZQGvrNA5w1hWZwo5MQn4u8LRdMCI2DCNvExKg=s900-c-k-c0x00ffffff-no-rj",
    country: "Sri Lanka",
    language: "Sinhala",
  },
  {
    id: "yt-UCBi2mrWuNuyYy4gbM6fU18Q",
    name: "ABC News (US)",
    channelId: "UCBi2mrWuNuyYy4gbM6fU18Q",
    handle: "https://www.youtube.com/@ABCNews",
    logoUrl: "https://yt3.googleusercontent.com/GJ8V0NX6NddGh9bf4zED4tsjPjjBK2hdp5FWHMy09pV7sdSkkE3yEhCRSch4waEb9ZavyUrWfw=s900-c-k-c0x00ffffff-no-rj",
    country: "United States",
    language: "English",
  },
  {
    id: "yt-UCEXGDNclvmg6RW0vipJYsTQ",
    name: "Channels Television",
    channelId: "UCEXGDNclvmg6RW0vipJYsTQ",
    handle: "https://www.youtube.com/@ChannelsTelevision",
    logoUrl: "https://yt3.googleusercontent.com/hBmtX1OA-mMEdfPqPdLzFxVeAlXKrc_wLU2z0la9sjIuTdjH_L7ISQl89c1AG2fkRAIQlTz_Hw=s900-c-k-c0x00ffffff-no-rj",
    country: "Nigeria",
    language: "English",
  },
];

/** The channel-form embed. A nocookie host would not match the app's
 *  `streamUrl.includes("youtube.com/embed")` test and would fail silently. */
export function androidStreamUrl(channelId: string): string {
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
}

/** Every live row, ready for the route. No database read: the list above is the
 *  catalogue, and nothing outside it can appear in the response. */
export function getAndroidLiveChannels(limit = 60): AndroidLiveRow[] {
  return ANDROID_LIVE.slice(0, limit).map((c) => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    streamUrl: androidStreamUrl(c.channelId),
    country: c.country,
    language: c.language,
    category: "News",
    isHD: true,
    isActive: true,
    rightsBasis: RIGHTS_LIVE,
    evidenceUrl: c.handle,
  }));
}

/** One live row, or null. A null is a 404 in the route — never a fallback. */
export function getAndroidChannel(id: string): AndroidLiveRow | null {
  const hit = ANDROID_LIVE.find((c) => c.id === id);
  return hit ? getAndroidLiveChannels().find((c) => c.id === id) ?? null : null;
}

/**
 * ON-DEMAND — the colour shelf.
 *
 * Each entry is a slug that already exists in the catalogue, plus the two
 * fields the shelf must not take from our own editorial row: the item page a
 * reviewer can open, and the licence statement read off that page. The rest of
 * the metadata (poster, synopsis, year, stream URL) comes from the row, so the
 * film plays from the same Internet Archive file the website already serves.
 */
type AndroidFilmEntry = {
  slug: string;
  evidenceUrl: string;
  rightsBasis: string;
};

export const ANDROID_FILMS: AndroidFilmEntry[] = [
  // 1963 · McLintock!
  {
    slug: "mclintock",
    evidenceUrl: "https://archive.org/details/mclintok_widescreen",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/mclintok_widescreen).",
  },
  // 1963 · Sword of Lancelot
  {
    slug: "sword-of-lancelot",
    evidenceUrl: "https://archive.org/details/cco_swordoflancelot",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/cco_swordoflancelot).",
  },
  // 1963 · The Sons of Hercules: Land of Darkness
  {
    slug: "the-sons-of-hercules-land-of-darkness",
    evidenceUrl: "https://archive.org/details/SonofHerculesTheLandofDarkness",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/SonofHerculesTheLandofDarkness).",
  },
  // 1963 · The Terror
  {
    slug: "the-terror",
    evidenceUrl: "https://archive.org/details/TheTerror",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/TheTerror).",
  },
  // 1962 · Eegah
  {
    slug: "eegah",
    evidenceUrl: "https://archive.org/details/Eegah",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/Eegah).",
  },
  // 1962 · The Invincible Gladiator
  {
    slug: "the-invincible-gladiator",
    evidenceUrl: "https://archive.org/details/AteneaFilmsPublicDomainTheInvincibleGladiator",
    rightsBasis: "Creative Commons Attribution \u2014 licence declared on the item's own Internet Archive page (https://archive.org/details/AteneaFilmsPublicDomainTheInvincibleGladiator).",
  },
  // 1962 · The Magic Sword
  {
    slug: "the-magic-sword",
    evidenceUrl: "https://archive.org/details/TheMagicSword",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/TheMagicSword).",
  },
  // 1961 · Hercules and the Captive Women
  {
    slug: "hercules-and-the-captive-women",
    evidenceUrl: "https://archive.org/details/cco__HerculesandtheCaptiveWomen",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/cco__HerculesandtheCaptiveWomen).",
  },
  // 1960 · Assignment Outer Space
  {
    slug: "assignment-outer-space",
    evidenceUrl: "https://archive.org/details/Assignment_Outer_Space",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/Assignment_Outer_Space).",
  },
  // 1960 · David and Goliath
  {
    slug: "david-and-goliath",
    evidenceUrl: "https://archive.org/details/PublicDomainAnsaFilmandBeaverChampionAttactionsDavidandGoliath1960",
    rightsBasis: "Creative Commons Attribution \u2014 licence declared on the item's own Internet Archive page (https://archive.org/details/PublicDomainAnsaFilmandBeaverChampionAttactionsDavidandGoliath1960).",
  },
  // 1960 · Esther and the King
  {
    slug: "esther-and-the-king",
    evidenceUrl: "https://archive.org/details/PublicdomainGalateaFilmandTitanusEstherandtheKing",
    rightsBasis: "Creative Commons Attribution \u2014 licence declared on the item's own Internet Archive page (https://archive.org/details/PublicdomainGalateaFilmandTitanusEstherandtheKing).",
  },
  // 1960 · First Spaceship on Venus
  {
    slug: "first-spaceship-on-venus",
    evidenceUrl: "https://archive.org/details/FirstSpaceshipOnVenusMPEG",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/FirstSpaceshipOnVenusMPEG).",
  },
  // 1960 · Joseph and His Brethren
  {
    slug: "joseph-and-his-brethren",
    evidenceUrl: "https://archive.org/details/PublicDomainJollyFilmJosephandHisBrethren",
    rightsBasis: "Creative Commons Attribution \u2014 licence declared on the item's own Internet Archive page (https://archive.org/details/PublicDomainJollyFilmJosephandHisBrethren).",
  },
  // 1959 · Hercules Unchained
  {
    slug: "hercules-unchained",
    evidenceUrl: "https://archive.org/details/HerculesUnchained",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/HerculesUnchained).",
  },
  // 1959 · The Giant of Marathon
  {
    slug: "the-giant-of-marathon",
    evidenceUrl: "https://archive.org/details/cco_TheGiantofMarathon",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/cco_TheGiantofMarathon).",
  },
  // 1959 · The Snow Queen (Animation)
  {
    slug: "the-snow-queen-animation",
    evidenceUrl: "https://archive.org/details/the_snow_queen_1959_animation",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/the_snow_queen_1959_animation).",
  },
  // 1956 · Daniel Boone, Trail Blazer
  {
    slug: "daniel-boone-trail-blazer",
    evidenceUrl: "https://archive.org/details/Daniel_Boone_-_Trail_Blazer",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/Daniel_Boone_-_Trail_Blazer).",
  },
  // 1954 · Last Time I Saw Paris, The
  {
    slug: "last-time-i-saw-paris-the",
    evidenceUrl: "https://archive.org/details/last_time_i_saw_paris",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/last_time_i_saw_paris).",
  },
  // 1953 · Beneath the 12-Mile Reef
  {
    slug: "beneath-the-12-mile-reef",
    evidenceUrl: "https://archive.org/details/beneath_the_12-mile_reef",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/beneath_the_12-mile_reef).",
  },
  // 1952 · Big Trees, The
  {
    slug: "big-trees-the",
    evidenceUrl: "https://archive.org/details/big_trees",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/big_trees).",
  },
  // 1952 · Jack and the Beanstalk
  {
    slug: "jack-and-the-beanstalk",
    evidenceUrl: "https://archive.org/details/jack_and_the_beanstalk_ipod",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/jack_and_the_beanstalk_ipod).",
  },
  // 1952 · The Snows of Kilimanjaro
  {
    slug: "the-snows-of-kilimanjaro",
    evidenceUrl: "https://archive.org/details/Kilimanjaro",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/Kilimanjaro).",
  },
  // 1951 · Drums in the Deep South
  {
    slug: "drums-in-the-deep-south",
    evidenceUrl: "https://archive.org/details/Drums_in_the_Deep_South",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/Drums_in_the_Deep_South).",
  },
  // 1951 · Royal Wedding
  {
    slug: "royal-wedding",
    evidenceUrl: "https://archive.org/details/royal_wedding",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/royal_wedding).",
  },
  // 1951 · Vengeance Valley
  {
    slug: "vengeance-valley",
    evidenceUrl: "https://archive.org/details/VengeanceValley",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/VengeanceValley).",
  },
  // 1950 · Sundowners
  {
    slug: "sundowners",
    evidenceUrl: "https://archive.org/details/sundowners",
    rightsBasis: "Public Domain \u2014 declared on the item's own Internet Archive page (https://archive.org/details/sundowners).",
  },
];

const FILM_ORDER = ANDROID_FILMS.map((f) => f.slug);

const filmSelect = {
  id: true,
  slug: true,
  name: true,
  posterUrl: true,
  backdropUrl: true,
  type: true,
  releaseYear: true,
  imdbRating: true,
  collection: true,
  isNew: true,
  synopsis: true,
  rating: true,
  durationMins: true,
  genres: true,
  cast: true,
  country: true,
  language: true,
  streamUrl: true,
  uploaderUrl: true,
} as const;

/** The shelf, newest year first — the order of ANDROID_FILMS, not of the row. */
export async function getAndroidFilms() {
  const rows = await prisma.title.findMany({
    where: { isActive: true, sourceKind: "archive-org", slug: { in: FILM_ORDER } },
    select: filmSelect,
  });
  const byslug = new Map(rows.map((r) => [r.slug, r]));
  return ANDROID_FILMS.map((f) => {
    const row = byslug.get(f.slug);
    if (!row) return null;   // row deleted or deactivated: the shelf loses the title, never invents one
    return { ...row, rightsBasis: f.rightsBasis, evidenceUrl: f.evidenceUrl };
  }).filter((x): x is NonNullable<typeof x> => x !== null);
}

/** One film with its episodes shape, or null. */
export async function getAndroidFilm(slug: string) {
  const entry = ANDROID_FILMS.find((f) => f.slug === slug);
  if (!entry) return null;
  const row = await prisma.title.findFirst({
    where: { slug, isActive: true, sourceKind: "archive-org" },
    select: { ...filmSelect, seasons: { select: { number: true, episodes: { select: { id: true, number: true, name: true, synopsis: true, stillUrl: true, streamUrl: true, durationMins: true }, orderBy: { number: "asc" as const } } }, orderBy: { number: "asc" as const } } },
  });
  if (!row) return null;
  return { ...row, rightsBasis: entry.rightsBasis, evidenceUrl: entry.evidenceUrl };
}

/** Related titles: the shelf itself and nothing else. Same shelf first, then the
 *  rest of the shelf — never the public catalogue, so a rail cannot leak a title
 *  the Android store does not carry. */
export async function getAndroidSimilar(slug: string, take = 8) {
  const films = await getAndroidFilms();
  const here = films.find((f) => f.slug === slug);
  const same = films.filter((f) => f.slug !== slug && here && f.collection === here.collection);
  const rest = films.filter((f) => f.slug !== slug && !same.includes(f));
  return [...same, ...rest]
    .slice(0, take)
    .map((f) => ({
      id: f.id, slug: f.slug, name: f.name, posterUrl: f.posterUrl,
      type: f.type, releaseYear: f.releaseYear, imdbRating: f.imdbRating,
    }));
}
