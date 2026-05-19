import { create } from 'zustand'

export const GUEST_ROLES = ['Admin', 'Chef', 'Cashier', 'Waiter']

const MOCK_DATA = {
  categories: [
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Mains' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Drinks' },
  ],
  menuItems: [
    { id: 1, category_id: 1, category: { id: 1, name: 'Starters' }, name: 'Hummus & Bread', description: 'Creamy hummus served with warm flatbread and olive oil drizzle.', price: 7500, image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400', is_available: true },
    { id: 2, category_id: 1, category: { id: 1, name: 'Starters' }, name: 'Fattoush Salad', description: 'Fresh garden salad with crispy pita chips, sumac dressing and pomegranate.', price: 8500, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', is_available: true },
    { id: 3, category_id: 2, category: { id: 2, name: 'Mains' }, name: 'Grilled Lamb Chops', description: 'Tender lamb chops marinated in herbs, served with roasted vegetables.', price: 32000, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', is_available: true },
    { id: 4, category_id: 2, category: { id: 2, name: 'Mains' }, name: 'Chicken Tikka', description: 'Juicy chicken tikka with basmati rice and mint chutney.', price: 22000, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', is_available: true },
    { id: 5, category_id: 2, category: { id: 2, name: 'Mains' }, name: 'Vegetable Biryani', description: 'Aromatic basmati rice with seasonal vegetables and whole spices.', price: 18000, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', is_available: false },
    { id: 6, category_id: 3, category: { id: 3, name: 'Desserts' }, name: 'Baklava', description: 'Layers of crispy pastry filled with pistachios and honey syrup.', price: 6500, image_url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400', is_available: true },
    { id: 7, category_id: 4, category: { id: 4, name: 'Drinks' }, name: 'Fresh Lemonade', description: 'Chilled lemonade with mint and a hint of rose water.', price: 4500, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', is_available: true },
    { id: 8, category_id: 4, category: { id: 4, name: 'Drinks' }, name: 'Jallab', description: 'Traditional grape and rose water drink with pine nuts and raisins.', price: 5000, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', is_available: true },
  ],
  tables: [
    { id: 1, qr_code_url: '', status: 'Occupied', sessions: [{ id: 1, status: 'Active' }] },
    { id: 2, qr_code_url: '', status: 'Occupied', sessions: [{ id: 2, status: 'Active' }] },
    { id: 3, qr_code_url: '', status: 'Available', sessions: [] },
    { id: 4, qr_code_url: '', status: 'Available', sessions: [] },
    { id: 5, qr_code_url: '', status: 'Occupied', sessions: [{ id: 3, status: 'Active' }] },
    { id: 6, qr_code_url: '', status: 'Available', sessions: [] },
  ],
  orders: [
    {
      id: 101, session_id: 1, status: 'Preparing', created_at: new Date(Date.now() - 8 * 60000).toISOString(),
      session: { id: 1, table_id: 1, table: { id: 1 } },
      order_items: [
        { id: 1, order_id: 101, menu_item_id: 1, quantity: 2, notes: 'Extra pita please', price_at_time: 7500, item: { id: 1, name: 'Hummus & Bread' } },
        { id: 2, order_id: 101, menu_item_id: 3, quantity: 1, notes: '', price_at_time: 32000, item: { id: 3, name: 'Grilled Lamb Chops' } },
      ],
    },
    {
      id: 102, session_id: 2, status: 'Pending', created_at: new Date(Date.now() - 3 * 60000).toISOString(),
      session: { id: 2, table_id: 2, table: { id: 2 } },
      order_items: [
        { id: 3, order_id: 102, menu_item_id: 4, quantity: 2, notes: '', price_at_time: 22000, item: { id: 4, name: 'Chicken Tikka' } },
        { id: 4, order_id: 102, menu_item_id: 7, quantity: 2, notes: '', price_at_time: 4500, item: { id: 7, name: 'Fresh Lemonade' } },
      ],
    },
    {
      id: 103, session_id: 3, status: 'Ready', created_at: new Date(Date.now() - 20 * 60000).toISOString(),
      session: { id: 3, table_id: 5, table: { id: 5 } },
      order_items: [
        { id: 5, order_id: 103, menu_item_id: 6, quantity: 3, notes: '', price_at_time: 6500, item: { id: 6, name: 'Baklava' } },
        { id: 6, order_id: 103, menu_item_id: 8, quantity: 2, notes: '', price_at_time: 5000, item: { id: 8, name: 'Jallab' } },
      ],
    },
    {
      id: 104, session_id: 1, status: 'Served', created_at: new Date(Date.now() - 35 * 60000).toISOString(),
      session: { id: 1, table_id: 1, table: { id: 1 } },
      order_items: [
        { id: 7, order_id: 104, menu_item_id: 2, quantity: 1, notes: '', price_at_time: 8500, item: { id: 2, name: 'Fattoush Salad' } },
      ],
    },
  ],
  users: [
    { id: 1, username: 'admin', role: 'Admin' },
    { id: 2, username: 'chef_ali', role: 'Chef' },
    { id: 3, username: 'waiter_sara', role: 'Waiter' },
    { id: 4, username: 'cashier_omar', role: 'Cashier' },
  ],
  stats: {
    daily_sales: 287500,
    today_orders: 14,
    active_tables: 3,
    top_items: [
      { menu_item: { id: 4, name: 'Chicken Tikka', price: 22000 }, total_sold: 28 },
      { menu_item: { id: 3, name: 'Grilled Lamb Chops', price: 32000 }, total_sold: 21 },
      { menu_item: { id: 1, name: 'Hummus & Bread', price: 7500 }, total_sold: 19 },
      { menu_item: { id: 7, name: 'Fresh Lemonade', price: 4500 }, total_sold: 17 },
      { menu_item: { id: 6, name: 'Baklava', price: 6500 }, total_sold: 15 },
    ],
  },
  sessions: {
    1: { id: 1, table_id: 1, status: 'Active', created_at: new Date(Date.now() - 45 * 60000).toISOString(), table: { id: 1 }, orders: [], total: 56000 },
    2: { id: 2, table_id: 2, status: 'Active', created_at: new Date(Date.now() - 20 * 60000).toISOString(), table: { id: 2 }, orders: [], total: 53000 },
    3: { id: 3, table_id: 5, status: 'Active', created_at: new Date(Date.now() - 55 * 60000).toISOString(), table: { id: 5 }, orders: [], total: 29500 },
  },
}

export const useGuestStore = create((set, get) => ({
  isGuest: false,
  guestRole: 'Admin',

  enterGuest: (role = 'Admin') => set({ isGuest: true, guestRole: role }),
  exitGuest: () => set({ isGuest: false, guestRole: 'Admin' }),
  setGuestRole: (role) => set({ guestRole: role }),
}))

export function getMockResponse(method, url) {
  const path = url.replace(/^\/api/, '')

  if (method === 'GET') {
    if (path === '/categories') return { status: 'success', data: { categories: MOCK_DATA.categories } }
    if (path === '/menu') return { status: 'success', data: { menuItems: MOCK_DATA.menuItems } }
    if (path === '/tables') return { status: 'success', data: { tables: MOCK_DATA.tables } }
    if (path === '/orders') return { status: 'success', data: { orders: MOCK_DATA.orders } }
    if (path === '/users') return { status: 'success', data: { users: MOCK_DATA.users } }
    if (path === '/stats') return { status: 'success', data: MOCK_DATA.stats }
    const billMatch = path.match(/^\/sessions\/(\d+)\/bill$/)
    if (billMatch) {
      const sid = Number(billMatch[1])
      const session = MOCK_DATA.sessions[sid]
      if (session) {
        const sessionOrders = MOCK_DATA.orders.filter(o => o.session_id === sid && o.status !== 'Canceled')
        const total = sessionOrders.reduce((sum, o) => sum + o.order_items.reduce((s, oi) => s + oi.price_at_time * oi.quantity, 0), 0)
        return { status: 'success', data: { session: { ...session, orders: sessionOrders, total } } }
      }
    }
  }

  return null
}