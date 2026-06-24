import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, CreditCard, Banknote } from 'lucide-react';

function App() {
  // 1. Khởi tạo state từ Local Storage thay vì dùng mảng fix cứng
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('app_chi_tieu_data');
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return []; // Trả về mảng rỗng nếu là lần đầu tiên sử dụng web
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [method, setMethod] = useState('transfer');

  // 2. Tự động lưu vào Local Storage mỗi khi mảng transactions thay đổi
  useEffect(() => {
    localStorage.setItem('app_chi_tieu_data', JSON.stringify(transactions));
  }, [transactions]);

  // Tính toán số dư tổng quan
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

  // Phân bổ số dư theo phương thức
  const totalTransfer = transactions.filter(t => t.method === 'transfer').reduce((acc, t) => acc + t.amount, 0);
  const totalCash = transactions.filter(t => t.method === 'cash').reduce((acc, t) => acc + t.amount, 0);

  // Format tiền tệ VNĐ
  const formatMoney = (money) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
  };

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      type,
      method
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  return (
    /* Background tối với các khối màu Highlight phát sáng */
    <div className="min-h-screen bg-slate-950 flex justify-center py-10 px-4 font-sans relative overflow-hidden">
      
      {/* Hiệu ứng mảng màu Highlight (Neon Glow) */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>
      <div className="absolute top-[30%] right-[-10%] w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-50"></div>

      {/* App Card - Giao diện kính mờ (Glassmorphism) */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-orange-900/20 overflow-hidden border border-white/40 z-10">
        
        {/* Header - Tổng quan số dư tông cam */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-orange-100 uppercase tracking-wider">Tổng tài sản</h2>
            <Wallet className="w-6 h-6 text-orange-200" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-md">{formatMoney(total)}</h1>
          
          {/* Box phân chia Tiền mặt & Chuyển khoản */}
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-orange-400/50">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-400/30 p-1.5 rounded-lg border border-orange-400/50">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-orange-200 uppercase">Chuyển khoản</span>
                <span className="text-sm font-semibold">{formatMoney(totalTransfer)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-orange-200 uppercase">Tiền mặt</span>
                <span className="text-sm font-semibold">{formatMoney(totalCash)}</span>
              </div>
              <div className="bg-orange-400/30 p-1.5 rounded-lg border border-orange-400/50">
                <Banknote className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê Thu / Chi */}
        <div className="grid grid-cols-2 gap-4 px-6 py-6 -mt-4 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 flex items-center space-x-3 border border-gray-100">
            <div className="bg-green-100 p-2.5 rounded-full text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Thu nhập</p>
              <p className="text-sm font-bold text-gray-800">{formatMoney(income)}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 flex items-center space-x-3 border border-gray-100">
            <div className="bg-red-100 p-2.5 rounded-full text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Chi tiêu</p>
              <p className="text-sm font-bold text-gray-800">{formatMoney(expense)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          {/* Form Thêm Giao Dịch */}
          <form onSubmit={addTransaction} className="mb-8 space-y-4">
            <h3 className="text-gray-800 font-bold border-b border-gray-100 pb-2 mb-4 text-lg">Thêm giao dịch</h3>
            
            {/* Chọn Loại: Thu / Chi */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  type === 'expense' ? 'bg-red-50 text-red-600 border-red-200 border-2' : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                Khoản chi
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  type === 'income' ? 'bg-green-50 text-green-600 border-green-200 border-2' : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                Khoản thu
              </button>
            </div>

            {/* Chọn Nguồn: Chuyển khoản / Tiền mặt */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  method === 'transfer' ? 'bg-orange-50 text-orange-600 border-orange-300 border-2 shadow-sm' : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <CreditCard className="w-4 h-4" /> <span>Chuyển khoản</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  method === 'cash' ? 'bg-orange-50 text-orange-600 border-orange-300 border-2 shadow-sm' : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <Banknote className="w-4 h-4" /> <span>Tiền mặt</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Tên giao dịch (VD: Ăn sáng...)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <input
                type="number"
                placeholder="Số tiền (VNĐ)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Lưu giao dịch</span>
            </button>
          </form>

          {/* Danh sách Giao Dịch */}
          <div>
            <h3 className="text-gray-800 font-bold border-b border-gray-100 pb-2 mb-4 text-lg">Lịch sử gần đây</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm italic">Bạn chưa có giao dịch nào.</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <li 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3.5 bg-white/80 rounded-2xl hover:bg-orange-50/80 transition-all group border border-gray-100 hover:border-orange-200 shadow-sm"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-1.5 h-10 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 text-sm">{transaction.text}</span>
                        <span className="text-[11px] text-gray-500 flex items-center mt-0.5 font-medium">
                          {transaction.method === 'transfer' ? (
                            <><CreditCard className="w-3 h-3 mr-1 text-orange-500"/> Chuyển khoản</>
                          ) : (
                            <><Banknote className="w-3 h-3 mr-1 text-orange-500"/> Tiền mặt</>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : ''}{formatMoney(transaction.amount)}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="Xóa giao dịch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;