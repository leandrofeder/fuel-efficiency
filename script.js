// ==================== CONFIGURAÇÕES ==================== 
const CACHE = {
    COMPARADOR: 'fuel_comparador',
    TRAJETO: 'fuel_trajeto',
    ECONOMIA: 'fuel_economia',
    HISTORICO: 'fuel_historico'
};

// ==================== UTILITÁRIOS ==================== 
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatNumber(value, decimals = 2) {
    return parseFloat(value).toFixed(decimals);
}

function salvarNoLocalStorage(chave, dados) {
    try {
        localStorage.setItem(chave, JSON.stringify(dados));
    } catch (e) {
        console.warn('Erro ao salvar:', e);
    }
}

function carregarDoLocalStorage(chave) {
    try {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : null;
    } catch (e) {
        console.warn('Erro ao carregar:', e);
        return null;
    }
}

function restaurarCampos() {
    // Restaurar comparador
    const dadosComparador = carregarDoLocalStorage(CACHE.COMPARADOR);
    if (dadosComparador) {
        Object.keys(dadosComparador).forEach(fuel => {
            const precoInput = document.getElementById(`preco-${fuel}`);
            const consumoInput = document.getElementById(`consumo-${fuel}`);
            if (precoInput) precoInput.value = dadosComparador[fuel].preco || '';
            if (consumoInput) consumoInput.value = dadosComparador[fuel].consumo || '';
        });
    }

    // Restaurar trajeto
    const dadosTrajeto = carregarDoLocalStorage(CACHE.TRAJETO);
    if (dadosTrajeto) {
        const distanciaInput = document.getElementById('distancia');
        const idaVoltaCheckbox = document.getElementById('ida-volta');
        if (distanciaInput) distanciaInput.value = dadosTrajeto.distancia || '';
        if (idaVoltaCheckbox) idaVoltaCheckbox.checked = dadosTrajeto.idaVolta || false;
        
        Object.keys(dadosTrajeto).forEach(fuel => {
            if (fuel !== 'distancia' && fuel !== 'idaVolta') {
                const consumoInput = document.getElementById(`consumo-trajeto-${fuel}`);
                const precoInput = document.getElementById(`preco-trajeto-${fuel}`);
                if (consumoInput) consumoInput.value = dadosTrajeto[fuel].consumo || '';
                if (precoInput) precoInput.value = dadosTrajeto[fuel].preco || '';
            }
        });
    }

    // Restaurar economia
    const dadosEconomia = carregarDoLocalStorage(CACHE.ECONOMIA);
    if (dadosEconomia) {
        Object.keys(dadosEconomia).forEach(key => {
            const input = document.getElementById(`economia-${key}`);
            if (input) input.value = dadosEconomia[key] || '';
        });
    }
}

// ==================== COMPARADOR ==================== 
function compararCombustiveis() {
    const combustiveis = {
        gasolina: {
            preco: parseFloat(document.getElementById('preco-gasolina').value) || 0,
            consumo: parseFloat(document.getElementById('consumo-gasolina').value) || 0
        },
        etanol: {
            preco: parseFloat(document.getElementById('preco-etanol').value) || 0,
            consumo: parseFloat(document.getElementById('consumo-etanol').value) || 0
        },
        diesel: {
            preco: parseFloat(document.getElementById('preco-diesel').value) || 0,
            consumo: parseFloat(document.getElementById('consumo-diesel').value) || 0
        },
        gnv: {
            preco: parseFloat(document.getElementById('preco-gnv').value) || 0,
            consumo: parseFloat(document.getElementById('consumo-gnv').value) || 0
        }
    };

    // Calcular custos
    Object.entries(combustiveis).forEach(([key, data]) => {
        const custo = data.consumo > 0 ? (data.preco / data.consumo).toFixed(4) : 0;
        document.getElementById(`custo-${key}`).textContent = data.consumo > 0 ? formatCurrency(custo) : 'R$ --';
    });

    // Encontrar melhor
    const validos = Object.entries(combustiveis)
        .map(([key, data]) => ({
            key,
            nome: ['⚫ Gasolina', '🟢 Etanol', '🔵 Diesel', '⚪ GNV']
                ['gasolina,etanol,diesel,gnv'.split(',').indexOf(key)],
            custo: data.consumo > 0 ? data.preco / data.consumo : Infinity,
            preco: data.preco,
            consumo: data.consumo
        }))
        .filter(c => c.custo !== Infinity)
        .sort((a, b) => a.custo - b.custo);

    let html = '';
    if (validos.length > 0) {
        const melhor = validos[0];
        const pior = validos[validos.length - 1];
        const economia = ((pior.custo - melhor.custo) / pior.custo * 100).toFixed(1);

        html = `
            <div class="melhor-opcao">
                ✓ MELHOR: ${melhor.nome}
            </div>
            <p><strong>Custo/km:</strong> ${formatCurrency(melhor.custo)}</p>
            <p><strong>Preço/L:</strong> ${formatCurrency(melhor.preco)}</p>
            <p><strong>Consumo:</strong> ${formatNumber(melhor.consumo, 1)} km/L</p>
            ${validos.length > 1 ? `
                <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                    <strong>Economia:</strong> ${economia}% vs ${pior.nome} (${formatCurrency(pior.custo - melhor.custo)}/km)
                </p>
            ` : ''}
        `;
    } else {
        html = '<p>Preencha todos os campos para comparar</p>';
    }

    document.getElementById('resultado-comparacao').innerHTML = html;

    // Salvar cache
    salvarNoLocalStorage(CACHE.COMPARADOR, combustiveis);
    showToast('✓ Comparação calculada');
}

// ==================== TRAJETO ==================== 
function atualizarDistancia() {
    const distancia = parseFloat(document.getElementById('distancia').value) || 0;
    const idaVolta = document.getElementById('ida-volta').checked;
    const total = idaVolta ? distancia * 2 : distancia;
    document.getElementById('distancia-display').textContent = `${formatNumber(total, 1)} km`;
}

function calcularTrajeto() {
    const distancia = parseFloat(document.getElementById('distancia').value) || 0;
    const idaVolta = document.getElementById('ida-volta').checked;
    const distanciaTotal = idaVolta ? distancia * 2 : distancia;

    if (distanciaTotal === 0) {
        showToast('⚠️ Insira uma distância válida');
        return;
    }

    const combustiveis = ['gasolina', 'etanol', 'diesel', 'gnv'];
    
    combustiveis.forEach(fuel => {
        const consumo = parseFloat(document.getElementById(`consumo-trajeto-${fuel}`).value) || 0;
        const preco = parseFloat(document.getElementById(`preco-trajeto-${fuel}`).value) || 0;

        if (consumo > 0 && preco > 0) {
            const litros = distanciaTotal / consumo;
            const custo = litros * preco;
            const unidade = fuel === 'gnv' ? 'm³' : 'L';
            
            document.getElementById(`litros-${fuel}`).textContent = `${formatNumber(litros, 2)} ${unidade}`;
            document.getElementById(`custo-trajeto-${fuel}`).textContent = formatCurrency(custo);
        } else {
            document.getElementById(`litros-${fuel}`).textContent = fuel === 'gnv' ? '-- m³' : '-- L';
            document.getElementById(`custo-trajeto-${fuel}`).textContent = 'R$ --';
        }
    });

    // Salvar cache
    const dados = {
        distancia: document.getElementById('distancia').value,
        idaVolta,
        gasolina: {
            consumo: document.getElementById('consumo-trajeto-gasolina').value,
            preco: document.getElementById('preco-trajeto-gasolina').value
        },
        etanol: {
            consumo: document.getElementById('consumo-trajeto-etanol').value,
            preco: document.getElementById('preco-trajeto-etanol').value
        },
        diesel: {
            consumo: document.getElementById('consumo-trajeto-diesel').value,
            preco: document.getElementById('preco-trajeto-diesel').value
        },
        gnv: {
            consumo: document.getElementById('consumo-trajeto-gnv').value,
            preco: document.getElementById('preco-trajeto-gnv').value
        }
    };
    salvarNoLocalStorage(CACHE.TRAJETO, dados);
    showToast('✓ Trajeto calculado');
}

function salvarCalculoTrajeto() {
    const distancia = parseFloat(document.getElementById('distancia').value) || 0;
    if (distancia === 0) {
        showToast('⚠️ Calcule um trajeto primeiro');
        return;
    }

    const historico = carregarDoLocalStorage(CACHE.HISTORICO) || [];
    const custos = {
        gasolina: parseFloat(document.getElementById('custo-trajeto-gasolina').textContent) || 0,
        etanol: parseFloat(document.getElementById('custo-trajeto-etanol').textContent) || 0,
        diesel: parseFloat(document.getElementById('custo-trajeto-diesel').textContent) || 0,
        gnv: parseFloat(document.getElementById('custo-trajeto-gnv').textContent) || 0
    };

    const validos = Object.entries(custos).filter(([_, c]) => c > 0);
    if (validos.length === 0) {
        showToast('⚠️ Nenhum cálculo válido');
        return;
    }

    const melhor = validos.reduce((a, b) => a[1] < b[1] ? a : b);
    const nomes = { gasolina: '⚫ Gasolina', etanol: '🟢 Etanol', diesel: '🔵 Diesel', gnv: '⚪ GNV' };

    historico.unshift({
        id: Date.now(),
        tipo: 'trajeto',
        distancia: parseFloat(document.getElementById('distancia').value) * (document.getElementById('ida-volta').checked ? 2 : 1),
        melhorOpcao: nomes[melhor[0]],
        custo: melhor[1],
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    salvarNoLocalStorage(CACHE.HISTORICO, historico);
    carregarHistorico();
    showToast('💾 Cálculo salvo no histórico!');
}

// ==================== ECONOMIA ==================== 
function calcularEconomia() {
    const distancia = parseFloat(document.getElementById('economia-distancia').value) || 0;
    if (distancia === 0) {
        showToast('⚠️ Insira uma distância');
        return;
    }

    const precoGasolina = parseFloat(document.getElementById('economia-preco-gasolina').value) || 0;
    const consumoGasolina = parseFloat(document.getElementById('economia-consumo-gasolina').value) || 0;
    const precoEtanol = parseFloat(document.getElementById('economia-preco-etanol').value) || 0;
    const consumoEtanol = parseFloat(document.getElementById('economia-consumo-etanol').value) || 0;

    if (!precoGasolina || !consumoGasolina || !precoEtanol || !consumoEtanol) {
        showToast('⚠️ Preencha todos os campos');
        return;
    }

    const litrosGasolina = distancia / consumoGasolina;
    const custoGasolina = litrosGasolina * precoGasolina;
    
    const litrosEtanol = distancia / consumoEtanol;
    const custoEtanol = litrosEtanol * precoEtanol;

    const economia = custoGasolina - custoEtanol;
    const economiaPerc = (economia / custoGasolina * 100).toFixed(1);

    let html = '';
    if (economia > 0) {
        html = `
            <div class="melhor-opcao">
                ✓ VOCÊ ECONOMIZA COM ETANOL
            </div>
            <p><strong>Gasolina:</strong> ${formatCurrency(custoGasolina)} (${formatNumber(litrosGasolina, 1)}L)</p>
            <p><strong>Etanol:</strong> ${formatCurrency(custoEtanol)} (${formatNumber(litrosEtanol, 1)}L)</p>
            <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                <strong>Economia/mês:</strong> ${formatCurrency(economia)} (${economiaPerc}%)
            </p>
        `;
    } else {
        html = `
            <div class="melhor-opcao" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                ✓ GASOLINA É MAIS VANTAJOSA
            </div>
            <p><strong>Gasolina:</strong> ${formatCurrency(custoGasolina)} (${formatNumber(litrosGasolina, 1)}L)</p>
            <p><strong>Etanol:</strong> ${formatCurrency(custoEtanol)} (${formatNumber(litrosEtanol, 1)}L)</p>
            <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                <strong>Diferença/mês:</strong> ${formatCurrency(Math.abs(economia))}
            </p>
        `;
    }

    document.getElementById('resultado-economia').innerHTML = html;

    // Salvar cache
    salvarNoLocalStorage(CACHE.ECONOMIA, {
        distancia: document.getElementById('economia-distancia').value,
        'preco-gasolina': precoGasolina,
        'consumo-gasolina': consumoGasolina,
        'preco-etanol': precoEtanol,
        'consumo-etanol': consumoEtanol
    });

    showToast('💰 Economia calculada');
}

// ==================== HISTÓRICO ==================== 
function carregarHistorico() {
    const historico = carregarDoLocalStorage(CACHE.HISTORICO) || [];
    const lista = document.getElementById('lista-historico');

    if (historico.length === 0) {
        lista.innerHTML = '<p class="empty-state">Nenhum cálculo salvo ainda</p>';
        return;
    }

    lista.innerHTML = historico.map(item => `
        <div class="history-item">
            <div class="history-item-info">
                <div class="history-item-title">${item.melhorOpcao} - ${formatNumber(item.distancia, 1)} km</div>
                <div class="history-item-date">${item.data} ${item.hora || ''}</div>
            </div>
            <div style="text-align: right;">
                <div class="history-item-value">${formatCurrency(item.custo)}</div>
                <button class="btn btn-small btn-danger" onclick="deletarDoHistorico(${item.id})" style="margin-top: 6px; width: 100%;">🗑️</button>
            </div>
        </div>
    `).join('');
}

function deletarDoHistorico(id) {
    const historico = carregarDoLocalStorage(CACHE.HISTORICO) || [];
    const novo = historico.filter(h => h.id !== id);
    salvarNoLocalStorage(CACHE.HISTORICO, novo);
    carregarHistorico();
    showToast('Deletado do histórico');
}

function limparHistorico() {
    if (confirm('Tem certeza? Seus cálculos serão apagados.')) {
        localStorage.removeItem(CACHE.HISTORICO);
        carregarHistorico();
        showToast('Histórico limpo');
    }
}

function exportarHistorico() {
    const historico = carregarDoLocalStorage(CACHE.HISTORICO) || [];
    if (historico.length === 0) {
        showToast('⚠️ Nenhum histórico para exportar');
        return;
    }

    let csv = 'Data,Hora,Tipo,Detalhes,Melhor Opção,Custo\n';
    historico.forEach(h => {
        csv += `"${h.data}","${h.hora || 'N/A'}","${h.tipo}","${h.distancia}km","${h.melhorOpcao}","${h.custo}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fuel-calc-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('📥 Exportado com sucesso');
}

// ==================== NAVEGAÇÃO ==================== 
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');

        // Remover classe active de todos
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        // Adicionar active
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Restaurar dados ao abrir
        if (tabName === 'comparador' || tabName === 'trajeto' || tabName === 'economia') {
            restaurarCampos();
        }
    });
});

// ==================== EVENT LISTENERS ==================== 
document.getElementById('distancia')?.addEventListener('input', atualizarDistancia);
document.getElementById('ida-volta')?.addEventListener('change', atualizarDistancia);

// Restaurar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    restaurarCampos();
    carregarHistorico();
    atualizarDistancia();

    // Salvar automaticamente
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            setTimeout(() => {
                if (input.id.startsWith('preco-') || input.id.startsWith('consumo-')) {
                    if (input.id.includes('trajeto')) {
                        salvarNoLocalStorage(CACHE.TRAJETO, {
                            distancia: document.getElementById('distancia').value,
                            idaVolta: document.getElementById('ida-volta').checked,
                            gasolina: {
                                consumo: document.getElementById('consumo-trajeto-gasolina').value,
                                preco: document.getElementById('preco-trajeto-gasolina').value
                            },
                            etanol: {
                                consumo: document.getElementById('consumo-trajeto-etanol').value,
                                preco: document.getElementById('preco-trajeto-etanol').value
                            },
                            diesel: {
                                consumo: document.getElementById('consumo-trajeto-diesel').value,
                                preco: document.getElementById('preco-trajeto-diesel').value
                            },
                            gnv: {
                                consumo: document.getElementById('consumo-trajeto-gnv').value,
                                preco: document.getElementById('preco-trajeto-gnv').value
                            }
                        });
                    }
                }
            }, 100);
        });
    });
});
