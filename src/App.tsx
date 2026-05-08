/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Info, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Camera,
  Coffee,
  ShoppingBag,
  Bus,
  Image as ImageIcon,
  ChevronDown,
  Globe
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Data ---

const DAYS = [
  {
    day: 1,
    title: "建立後勤補給基地",
    highlights: [
      { icon: <Bus className="w-4 h-4" />, label: "機場接駁", detail: "Grab (200B) or CR Bus (20B)。" },
      { icon: <MapPin className="w-4 h-4" />, label: "交通勘察", detail: "前往第一巴士站確認往美塞車次。" },
      { icon: <ShoppingBag className="w-4 h-4" />, label: "物資補給", detail: "清萊夜市 (Night Bazaar) 補齊生活用品。" },
      { icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />, label: "關鍵動作", detail: "購買泰國長效電信卡、兌換泰國現鈔。" }
    ],
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1000",
    description: "抵達清萊後的第一步是確保基礎物資與後續交通通暢。"
  },
  {
    day: 2,
    title: "文化洗禮與身心備戰",
    highlights: [
      { icon: <Coffee className="w-4 h-4" />, label: "行程亮點", detail: "上午品嚐 Khao Soy Maesai 咖哩麵。下午造訪「白廟」與「藍廟」。" },
      { icon: <Camera className="w-4 h-4" />, label: "文化記憶", detail: "這兩座寺廟視覺張力極強，是進入緬甸前最重要的文化記憶點。" },
      { icon: <ShieldCheck className="w-4 h-4 text-orange-500" />, label: "關鍵字", detail: "防蚊液、腸胃藥、個人備妥常用藥。" }
    ],
    image: "https://www.vikipandit.com/wp-content/uploads/Wat-Rong-Khun.jpg",
    description: "透過文化巡禮沉澱心靈，並完成個人藥品的最後整備。"
  },
  {
    day: 3,
    title: "推進邊境：移防美塞",
    highlights: [
      { icon: <ImageIcon className="w-4 h-4" />, label: "移動路徑", detail: "上午參觀黑屋博物館(黑廟)，下午前往最北端——美塞(Mae Sai)。" },
      { icon: <Bus className="w-4 h-4" />, label: "交通/關鍵", detail: "Local Bus (45B) 或 Minivan (100B)。確認所有證件(護照、簽證、合約)。" },
      { icon: <ShieldCheck className="w-4 h-4 text-blue-500" />, label: "安全措施", detail: "實體影本與數位雲端檔案分開存放。" }
    ],
    image: "https://shannews.org/wp-content/uploads/2023/02/Tachileik-Mae-Sai-Friendship-Gate-1008x801.jpg",
    description: "向國境邊緣推進，確保所有法律文件與身分證明處於待命狀態。"
  },
  {
    day: 4,
    title: "地理實測：金三角區域",
    highlights: [
      { icon: <MapPin className="w-4 h-4" />, label: "地理空間", detail: "從美塞前往金三角地標，觀察三國交界地形，對環境建立認知。" },
      { icon: <Info className="w-4 h-4" />, label: "場域研究", detail: "參觀「鴉片博物館」，了解區域歷史與現況背景。" },
      { icon: <Globe className="w-4 h-4 text-blue-500" />, label: "關鍵動作", detail: "下載大其力周遭 50 公里離線地圖。" }
    ],
    image: "https://www.bonvoyagethailand.com/wp-content/uploads/2021/01/golden-triangle-chiang-rai-aerial.jpg",
    description: "實地觀察邊境地形，為即將跨越的空間邊界做心理與數據準備。"
  },
  {
    day: 5,
    title: "最後整備：進入戰備狀態",
    highlights: [
      { icon: <Coffee className="w-4 h-4" />, label: "身心調整", detail: "上午在「翠峰茶園」享受最後的平靜時光。" },
      { icon: <ShoppingBag className="w-4 h-4" />, label: "採購/技術", detail: "採購行動電源、瓶裝水、乾糧。測試手機 2 套以上 VPN 翻牆狀況。" },
      { icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />, label: "對接確認", detail: "與工作聯絡人確認翌日 08:00 交接細節。" }
    ],
    image: "https://img.freepik.com/premium-photo/beautiful-scenery-choui-fong-tea-plantation-mae-chan-tourist-attraction-chiang-rai-thailand_97567-827.jpg",
    description: "在最後的精緻時光中，完成所有技術環境與物資備載的最後檢查。"
  },
  {
    day: 6,
    title: "正式跨國：進入大其力",
    highlights: [
      { icon: <Calendar className="w-4 h-4 text-red-500" />, label: "08:00 準時跨越", detail: "泰國端出境審核與護照蓋章。" },
      { icon: <ArrowRight className="w-4 h-4" />, label: "橋樑步行", detail: "跨過「泰緬友誼大橋」(約 10 分鐘) 入境緬甸。" },
      { icon: <ShieldCheck className="w-4 h-4" />, label: "對接流程", detail: "提交 e-Visa 與查驗護照。第一時間傳送定位給緊急聯絡人。" }
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Thai-Myanmar_friendship_bridge.jpg",
    description: "跨越友誼大橋，正式進入大其力任務區域。保持高度警覺，完成身分確認。"
  }
];

const BUDGET_DATA = [
  { name: '國際機票', value: 13500 },
  { name: '五晚住宿', value: 5000 },
  { name: '交通與門票', value: 6000 },
  { name: '物資與餐飲', value: 3500 },
  { name: '緊急預備金', value: 2000 },
];

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
        <span className="font-semibold tracking-tight text-gray-800">Mission: Chiang Rai</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
        <a href="#blueprint" className="hover:text-blue-600 transition-colors">藍圖</a>
        <a href="#itinerary" className="hover:text-blue-600 transition-colors">行程</a>
        <a href="#budget" className="hover:text-blue-600 transition-colors">預算</a>
        <a href="#security" className="hover:text-blue-600 transition-colors">安全</a>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors">
        立即下載 PDF
      </button>
    </div>
  </nav>
);

export default function App() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
              清明連假：<br />
              <span className="text-blue-600">清萊至大其力</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-10 font-medium">
              六天五夜跨國邊境任務全記錄
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-blue-500 font-bold uppercase tracking-widest">
              <span>2024年4月行程方案</span>
              <span className="hidden md:block">•</span>
              <span>跨境任務對接</span>
            </div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-16 flex justify-center"
            >
              <ChevronDown className="w-8 h-8 text-gray-300" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blueprint Section */}
      <section id="blueprint" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">六日任務執行藍圖</h2>
            <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { phase: "Phase 1", title: "建立基地", days: "Day 1-2", desc: "抵達清萊，完成文化巡禮與物資初步採購。" },
              { phase: "Phase 2", title: "推進邊境", days: "Day 3-4", desc: "移防美塞，進行金三角地理實測與空間連結。" },
              { phase: "Phase 3", title: "正式跨國", days: "Day 5-6", desc: "最後戰備衝刺，準時跨越大橋進入緬甸。" }
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{p.phase}</div>
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <div className="text-gray-400 text-sm mb-4">{p.days}</div>
                  <p className="text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section id="itinerary" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">任務詳細時程</h2>
              <p className="text-gray-500 font-medium">一步一步，踏實完成跨國對接。</p>
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-xl">
              {DAYS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    activeDay === i ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  D{i + 1}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img 
                  src={DAYS[activeDay].image} 
                  alt={DAYS[activeDay].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-blue-600 font-black text-lg">
                  Day {DAYS[activeDay].day}
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900 leading-tight">
                  {DAYS[activeDay].title}
                </h3>
                <p className="text-gray-500 mb-8 text-lg font-medium">
                  {DAYS[activeDay].description}
                </p>
                <div className="space-y-4">
                  {DAYS[activeDay].highlights.map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-100"
                    >
                      <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                        {h.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700">{h.label}</div>
                        <div className="text-sm text-gray-500 font-medium">{h.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Budget Section */}
      <section id="budget" className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <TrendingUp className="text-blue-400" />
              預算分配分析
            </h2>
            <p className="text-gray-400 font-medium">Total: <span className="text-blue-400 font-bold">30,000 TWD</span></p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BUDGET_DATA} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    fontWeight={600} 
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {BUDGET_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-lg font-bold mb-6 text-blue-400">關鍵支出說明</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    國際機票佔比最高 (45%)，建議提早預定。
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    物資與餐飲預算已包含夜市備貨需求。
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-blue-300" />
                    預備金用於應對邊境突發狀況。
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 italic">註：預算以新台幣計，清明連假期間機票成本較高。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Checklist Section */}
      <section id="security" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Checklist */}
            <div>
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4">關鍵物資檢查清單</h2>
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
              </div>
              <div className="space-y-6">
                {[
                  { category: "文件類", items: "護照正本、緬甸 e-Visa (紙本 x2)、泰國免簽/簽證、工作合約影本。" },
                  { category: "通訊類", items: "泰國長效卡、大容量行動電源、2 套以上 VPN (測試完成)。" },
                  { category: "藥品類", items: "防蚊液(強效)、腸胃藥、感冒與發燒藥、個人固定用藥。" },
                  { category: "數位類", items: "Google Maps 離線地圖、雲端備份所有文件掃描檔。" }
                ].map((c, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 mr-2">{c.category}:</span>
                      <span className="text-gray-500">{c.items}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security SOP */}
            <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
               <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10" />
               <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-8">安全與風險控管 SOP</h2>
                 <div className="space-y-8">
                   <div>
                     <div className="flex items-center gap-3 mb-3">
                       <Globe className="w-5 h-5 text-blue-200" />
                       <h4 className="font-bold">通訊安全</h4>
                     </div>
                     <p className="text-blue-50/80 text-sm leading-relaxed">
                       進入大其力後，第一時間確認漫遊或當地卡訊號，並傳送定位給台灣聯絡人。測試網路速度是否足以支援安全回報。
                     </p>
                   </div>
                   <div className="h-px bg-white/20" />
                   <div>
                     <div className="flex items-center gap-3 mb-3">
                       <MapPin className="w-5 h-5 text-blue-200" />
                       <h4 className="font-bold">接頭驗證</h4>
                     </div>
                     <p className="text-blue-50/80 text-sm leading-relaxed">
                       跨國前晚再次確認接頭人姓名。入境後，核對車號與身分後再上車，保持警覺直到抵達工作地點。
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Question Section */}
      <footer className="py-24 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">問題與討論</h2>
            <p className="text-lg text-gray-500 mb-12">祝您旅途平安，順利完成跨國對接。</p>
            
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">緊急聯繫專線</div>
                <div className="text-lg font-mono font-bold text-gray-900">+886-XXX-XXX-XXX</div>
              </div>
            </div>

            <div className="mt-24 pt-12 border-t border-gray-200 text-xs text-gray-400 font-medium">
              © 2024 Chiang Rai to Tachileik Mission Guide. All rights reserved.
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
