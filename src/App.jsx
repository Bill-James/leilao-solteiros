import React, { useState, useEffect } from 'react';
import { Heart, Flame, Users, Clock, TrendingUp, Plus, Play, Pause, X, LogOut } from 'lucide-react';
import { database } from './firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';

const App = () => {
  const [view, setView] = useState('login');
  const [participantNumber, setParticipantNumber] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const [newExp, setNewExp] = useState({
    title: '',
    description: '',
    duration: 120,
    startingBid: 500
  });

  // Sincronizar com Firebase em tempo real
  useEffect(() => {
    const experiencesRef = ref(database, 'experiences');
    const unsubscribe = onValue(experiencesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const expArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setExperiences(expArray);
      } else {
        setExperiences([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Timer automático
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      experiences.forEach(exp => {
        if (exp.status === 'active' && exp.endTime <= now) {
          const expRef = ref(database, `experiences/${exp.id}`);
          update(expRef, { status: 'ended' });
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [experiences]);

  const handleLogin = (type) => {
    if (type === 'organizer') {
      setView('organizer');
    } else {
      if (participantNumber.trim()) {
        setView('participant');
      }
    }
  };

  const createExperience = () => {
    if (!newExp.title.trim()) return;
    
    const experiencesRef = ref(database, 'experiences');
    const newExpRef = push(experiencesRef);
    
    const exp = {
      ...newExp,
      status: 'pending',
      currentBid: newExp.startingBid,
      leadingBidder: null,
      endTime: null,
      createdAt: Date.now()
    };
    
    set(newExpRef, exp);
    setNewExp({ title: '', description: '', duration: 120, startingBid: 500 });
  };

  const startExperience = (id) => {
    const expRef = ref(database, `experiences/${id}`);
    const exp = experiences.find(e => e.id === id);
    update(expRef, { 
      status: 'active', 
      endTime: Date.now() + exp.duration * 1000 
    });
  };

  const pauseExperience = (id) => {
    const expRef = ref(database, `experiences/${id}`);
    update(expRef, { status: 'paused' });
  };

  const cancelExperience = (id) => {
    const expRef = ref(database, `experiences/${id}`);
    remove(expRef);
  };

  const placeBid = (expId, amount) => {
    const exp = experiences.find(e => e.id === expId);
    if (amount > exp.currentBid && exp.status === 'active') {
      const expRef = ref(database, `experiences/${expId}`);
      update(expRef, {
        currentBid: amount,
        leadingBidder: participantNumber
      });
      setSelectedExp(null);
      setBidAmount('');
    }
  };

  const getTimeRemaining = (exp) => {
    if (exp.status !== 'active') return null;
    const remaining = Math.max(0, exp.endTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // LOGIN VIEW
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full">
                <Heart className="w-12 h-12 text-white" fill="currentColor" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Festa dos Solteiros</h1>
            <p className="text-gray-600">Leilão de Experiências +18</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Participante
              </label>
              <input
                type="text"
                value={participantNumber}
                onChange={(e) => setParticipantNumber(e.target.value)}
                placeholder="Ex: 42"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg"
              />
            </div>

            <button
              onClick={() => handleLogin('participant')}
              disabled={!participantNumber.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Users className="w-5 h-5" />
              Entrar como Participante
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <button
              onClick={() => handleLogin('organizer')}
              className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5" />
              Painel do Organizador
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW
  if (view === 'participant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-red-600 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
              </div>
              <div>
                <p className="text-white text-sm">Você é o participante</p>
                <p className="text-white font-bold text-xl">#{participantNumber}</p>
              </div>
            </div>
            <button
              onClick={() => setView('login')}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>

          <div className="space-y-4">
            {experiences.length === 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white">
                <Flame className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">Nenhuma experiência disponível ainda...</p>
              </div>
            )}

            {experiences.map(exp => (
              <div key={exp.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4">
                  <h3 className="text-white font-bold text-xl">{exp.title}</h3>
                  <p className="text-white/90 text-sm mt-1">{exp.description}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-600 text-sm mb-1">Lance Atual</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {exp.currentBid.toLocaleString()} Kz
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-600 text-sm mb-1">Liderando</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {exp.leadingBidder ? `#${exp.leadingBidder}` : '---'}
                      </p>
                    </div>
                  </div>

                  {exp.status === 'active' && (
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800">Tempo Restante:</span>
                      </div>
                      <span className="text-2xl font-mono font-bold text-yellow-800">
                        {getTimeRemaining(exp)}
                      </span>
                    </div>
                  )}

                  {exp.status === 'ended' && (
                    <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 mb-4 text-center">
                      <p className="font-bold text-green-800 text-lg">🎉 Leilão Encerrado!</p>
                      <p className="text-green-700 mt-2">
                        Vencedor: <span className="font-bold">#{exp.leadingBidder || 'Nenhum'}</span>
                      </p>
                    </div>
                  )}

                  {exp.status === 'pending' && (
                    <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4 mb-4 text-center">
                      <p className="font-bold text-blue-800">⏳ Aguardando início...</p>
                    </div>
                  )}

                  {exp.status === 'paused' && (
                    <div className="bg-gray-50 border-2 border-gray-400 rounded-xl p-4 mb-4 text-center">
                      <p className="font-bold text-gray-800">⏸️ Leilão Pausado</p>
                    </div>
                  )}

                  {exp.status === 'active' && (
                    <button
                      onClick={() => setSelectedExp(exp)}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-5 h-5" />
                      Fazer Lance
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedExp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">{selectedExp.title}</h3>
              <p className="text-gray-600 mb-4">
                Lance atual: <span className="font-bold">{selectedExp.currentBid.toLocaleString()} Kz</span>
              </p>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Mínimo: ${selectedExp.currentBid + 100} Kz`}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedExp(null);
                    setBidAmount('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => placeBid(selectedExp.id, parseInt(bidAmount))}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg"
                >
                  Confirmar Lance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ORGANIZER VIEW
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Painel do Organizador</h1>
                <p className="text-gray-600">Gerencie as experiências do leilão</p>
              </div>
            </div>
            <button
              onClick={() => setView('login')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nova Experiência
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newExp.title}
                onChange={(e) => setNewExp({...newExp, title: e.target.value})}
                placeholder="Título (ex: Jantar Romântico)"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              />
              <textarea
                value={newExp.description}
                onChange={(e) => setNewExp({...newExp, description: e.target.value})}
                placeholder="Descrição da experiência..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none h-24"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (segundos)
                  </label>
                  <input
                    type="number"
                    value={newExp.duration}
                    onChange={(e) => setNewExp({...newExp, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lance Inicial (Kz)
                  </label>
                  <input
                    type="number"
                    value={newExp.startingBid}
                    onChange={(e) => setNewExp({...newExp, startingBid: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={createExperience}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Criar Experiência
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Experiências Ativas</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {experiences.map(exp => (
                <div key={exp.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{exp.title}</h3>
                      <p className="text-sm text-gray-600">{exp.currentBid.toLocaleString()} Kz</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      exp.status === 'active' ? 'bg-green-100 text-green-800' :
                      exp.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      exp.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {exp.status === 'active' ? 'Ativo' :
                       exp.status === 'paused' ? 'Pausado' :
                       exp.status === 'ended' ? 'Encerrado' : 'Pendente'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {exp.status === 'pending' && (
                      <button
                        onClick={() => startExperience(exp.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Iniciar
                      </button>
                    )}
                    {exp.status === 'active' && (
                      <button
                        onClick={() => pauseExperience(exp.id)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded text-sm font-semibold hover:bg-yellow-600 flex items-center justify-center gap-1"
                      >
                        <Pause className="w-4 h-4" />
                        Pausar
                      </button>
                    )}
                    {exp.status === 'paused' && (
                      <button
                        onClick={() => startExperience(exp.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Retomar
                      </button>
                    )}
                    {exp.status !== 'ended' && (
                      <button
                        onClick={() => cancelExperience(exp.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
