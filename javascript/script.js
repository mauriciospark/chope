/*
  ============================================================================
  PROPRIETÁRIO: Mauricio Spark
  MARCA:        SparkMauricio
  PROJETO:      Chopp
  VERSÃO:       v1.0.0
  LINHAGEM:     SPARK
  ============================================================================
  Documento de Planejamento de Escopo
  COPYRIGHT: © 2026 / Mauricio Spark. Todos os direitos reservados.
  ============================================================================
*/
var KEY = "latinhas_v1",
  tab = "direta";
var S = {
  preco: 5,
  precoCaixa: 50,
  tamCaixa: 12,
  estoque: 0,
  vendas: [],
  reservas: [],
};
try {
  var r = localStorage.getItem(KEY);
  if (r) S = JSON.parse(r);
} catch (e) {}
if (typeof S.estoque !== "number") S.estoque = 0;
if (typeof S.precoCaixa !== "number") S.precoCaixa = 50;
if (typeof S.tamCaixa !== "number") S.tamCaixa = 12;
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
}
function $(id) {
  return document.getElementById(id);
}
function R(n) {
  return "R$ " + Number(n).toFixed(2).replace(".", ",");
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function now() {
  return new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stats() {
  var fat = 0,
    ent = 0,
    guard = 0;
  S.vendas.forEach(function (v) {
    fat += v.total;
    ent += v.qtd;
  });
  S.reservas.forEach(function (x) {
    fat += x.total;
    ent += x.comprado - x.restante;
    guard += x.restante;
  });
  $("stats").innerHTML =
    '<div class="stat"><b style="color:' +
    (S.estoque <= 10 ? "var(--bad)" : "var(--ok)") +
    '">' +
    S.estoque +
    "</b><span>Em estoque</span></div>" +
    '<div class="stat"><b>' +
    R(fat) +
    "</b><span>Total vendido</span></div>" +
    '<div class="stat"><b>' +
    ent +
    "</b><span>Latas entregues</span></div>" +
    '<div class="stat"><b>' +
    guard +
    "</b><span>Latas guardadas</span></div>";
}

function formVenda(ind) {
  return (
    '<div class="card"><div class="row"><div><label>Preço da lata (R$)</label><input id="preco" type="number" step="0.01" min="0" value="' +
    S.preco +
    '"></div>' +
    '<div><label>Preço da caixinha (R$)</label><input id="pcx" type="number" step="0.01" min="0" value="' +
    S.precoCaixa +
    '"></div>' +
    '<div><label>Latas na caixinha</label><input id="tcx" type="number" min="1" value="' +
    S.tamCaixa +
    '"></div></div>' +
    "<label>" +
    (ind
      ? "Nome da pessoa / nº do computador"
      : "Nome / computador (opcional)") +
    '</label><input id="nome" placeholder="Ex.: Computador 1 – João">' +
    "<label>Quantidade de latinhas" +
    (ind ? " (ex.: 12 da caixinha)" : "") +
    '</label><input id="qtd" type="number" min="1" value="' +
    (ind ? 12 : 1) +
    '">' +
    '<div class="tot" id="tot"></div>' +
    '<button class="go" id="ok">' +
    (ind ? "Guardar na caixa" : "Vender e entregar") +
    "</button></div>"
  );
}
function preco(q) {
  var p = parseFloat($("preco").value) || 0,
    pc = parseFloat($("pcx").value) || 0,
    t = Math.max(1, parseInt($("tcx").value) || 1);
  var cx = Math.floor(q / t),
    av = q % t;
  return { total: cx * pc + av * p, cx: cx, av: av };
}
function calc() {
  var q = parseInt($("qtd").value) || 0,
    r = preco(q);
  $("tot").innerHTML =
    "Total: " +
    R(r.total) +
    '<div class="mut" style="font-weight:400">' +
    (r.cx ? r.cx + " caixinha(s)" : "") +
    (r.cx && r.av ? " + " : "") +
    (r.av || !r.cx ? r.av + " lata(s) avulsa(s)" : "") +
    " · Estoque: " +
    S.estoque +
    "</div>";
}
function bindVenda(ind) {
  calc();
  $("preco").oninput =
    $("pcx").oninput =
    $("tcx").oninput =
    $("qtd").oninput =
      calc;
  $("ok").onclick = function () {
    var q = parseInt($("qtd").value) || 0,
      n = $("nome").value.trim(),
      tot = preco(q).total;
    if (q < 1) {
      alert("Informe a quantidade.");
      return;
    }
    if (ind && !n) {
      alert("Informe o nome da pessoa.");
      $("nome").focus();
      return;
    }
    if (q > S.estoque) {
      alert("Estoque insuficiente: você tem só " + S.estoque + " latinha(s).");
      return;
    }
    S.preco = parseFloat($("preco").value) || 0;
    S.precoCaixa = parseFloat($("pcx").value) || 0;
    S.tamCaixa = Math.max(1, parseInt($("tcx").value) || 1);
    S.estoque -= q;
    if (ind)
      S.reservas.unshift({
        id: Date.now(),
        nome: n,
        comprado: q,
        restante: q,
        total: tot,
        data: now(),
        log: [],
      });
    else
      S.vendas.unshift({
        nome: n || "Balcão",
        qtd: q,
        total: tot,
        data: now(),
      });
    save();
    tab = ind ? "guardadas" : "hist";
    render();
  };
}

function guardadas() {
  var at = S.reservas.filter(function (x) {
    return x.restante > 0;
  });
  if (!at.length)
    return '<div class="card mut">Nenhuma reserva ativa. Cadastre em “Compra indireta”.</div>';
  return at
    .map(function (x) {
      var ret = x.comprado - x.restante;
      return (
        '<div class="card res"><h3><span>' +
        esc(x.nome) +
        "</span><span>" +
        x.restante +
        " / " +
        x.comprado +
        "</span></h3>" +
        '<div class="mut">Pegou ' +
        ret +
        " · restam " +
        x.restante +
        " guardadas · " +
        x.data +
        "</div>" +
        '<div class="bar"><i style="width:' +
        (ret / x.comprado) * 100 +
        '%"></i></div>' +
        '<div class="grid"><div><label>Quantas vai pegar agora?</label><input type="number" min="1" max="' +
        x.restante +
        '" value="1" id="q' +
        x.id +
        '"></div>' +
        '<button class="sm" data-id="' +
        x.id +
        '">Retirar</button></div></div>'
      );
    })
    .join("");
}
function bindGuardadas() {
  document.querySelectorAll(".sm").forEach(function (b) {
    b.onclick = function () {
      var id = +b.dataset.id,
        x = S.reservas.filter(function (y) {
          return y.id === id;
        })[0];
      var q = parseInt($("q" + id).value) || 0;
      if (q < 1) return;
      if (q > x.restante) {
        alert("Só restam " + x.restante + " latinhas guardadas.");
        return;
      }
      x.restante -= q;
      x.log.push({ q: q, data: now() });
      if (x.restante === 0) {
        x.fim = now();
        alert(
          x.nome + " pegou todas as " + x.comprado + ". Saldo guardado zerado!",
        );
      }
      save();
      render();
    };
  });
}

function hist() {
  var h =
    '<div class="card"><b>Vendas diretas</b><ul>' +
    (S.vendas.length
      ? S.vendas
          .map(function (v) {
            return (
              "<li>" +
              esc(v.nome) +
              " · " +
              v.qtd +
              " lata(s) · " +
              R(v.total) +
              '<div class="mut">' +
              v.data +
              "</div></li>"
            );
          })
          .join("")
      : '<li class="mut">Nada ainda.</li>') +
    "</ul></div>";
  var fin = S.reservas.filter(function (x) {
    return x.restante === 0;
  });
  h +=
    '<div class="card done" style="margin-top:10px"><b>Reservas finalizadas</b><ul>' +
    (fin.length
      ? fin
          .map(function (x) {
            return (
              "<li>" +
              esc(x.nome) +
              ' <span class="tag">zerada</span> · ' +
              x.comprado +
              " latas · " +
              R(x.total) +
              '<div class="mut">Comprou ' +
              x.data +
              " · terminou " +
              x.fim +
              " · " +
              x.log.length +
              " retirada(s)</div></li>"
            );
          })
          .join("")
      : '<li class="mut">Nenhuma ainda.</li>') +
    "</ul></div>";
  h +=
    '<p style="text-align:center"><button class="link" id="reset">Apagar todos os dados</button></p>';
  return h;
}

function estoqueView() {
  var low = S.estoque <= 10;
  return (
    '<div class="card"><div class="mut">Latinhas disponíveis</div><div style="font-size:44px;font-weight:700;color:' +
    (low ? "var(--bad)" : "var(--ok)") +
    '">' +
    S.estoque +
    "</div>" +
    (low
      ? '<div class="mut" style="color:var(--bad)">Estoque baixo, hora de repor!</div>'
      : "") +
    '<label>Quantidade</label><input id="eq" type="number" min="0" value="12">' +
    '<div class="row"><button class="go" id="eadd">Adicionar ao estoque</button><button class="go" id="eset" style="background:var(--mut)">Definir total</button></div>' +
    '<p class="mut">“Adicionar” soma ao que já tem (nova compra). “Definir total” corrige a contagem. Cada venda desconta do estoque automaticamente.</p></div>'
  );
}
function bindEstoque() {
  $("eadd").onclick = function () {
    var q = parseInt($("eq").value) || 0;
    if (q < 1) return;
    S.estoque += q;
    save();
    render();
  };
  $("eset").onclick = function () {
    var q = parseInt($("eq").value);
    if (isNaN(q) || q < 0) return;
    S.estoque = q;
    save();
    render();
  };
}

function configView() {
  return (
    '<div class="card"><b>Exportar dados</b><p class="mut">Faça backup dos seus dados em formato JSON.</p>' +
    '<button class="go" id="export">Baixar backup</button></div>' +
    '<div class="card" style="margin-top:10px"><b>Importar dados</b><p class="mut">Restaure dados de um backup anterior.</p>' +
    '<label>Arquivo JSON</label><input id="importFile" type="file" accept=".json">' +
    '<button class="go" id="import" style="margin-top:12px">Restaurar backup</button></div>'
  );
}

function bindConfig() {
  $("export").onclick = function () {
    var data = JSON.stringify(S, null, 2);
    var blob = new Blob([data], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download =
      "chope_backup_" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  $("import").onclick = function () {
    var fileInput = $("importFile");
    if (!fileInput.files.length) {
      alert("Selecione um arquivo JSON para importar.");
      return;
    }
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        if (
          typeof data.preco !== "number" ||
          typeof data.estoque !== "number"
        ) {
          alert("Arquivo inválido: formato incorreto.");
          return;
        }
        if (confirm("Isso substituirá todos os dados atuais. Continuar?")) {
          S = data;
          save();
          render();
          alert("Dados importados com sucesso!");
        }
      } catch (err) {
        alert("Erro ao ler arquivo: formato JSON inválido.");
      }
    };
    reader.readAsText(file);
  };
}
function render() {
  stats();
  document.querySelectorAll("#nav button").forEach(function (b) {
    b.className = b.dataset.t === tab ? "on" : "";
  });
  var v = $("v");
  if (tab === "direta") {
    v.innerHTML = formVenda(false);
    bindVenda(false);
  } else if (tab === "indireta") {
    v.innerHTML = formVenda(true);
    bindVenda(true);
  } else if (tab === "guardadas") {
    v.innerHTML = guardadas();
    bindGuardadas();
  } else if (tab === "estoque") {
    v.innerHTML = estoqueView();
    bindEstoque();
  } else if (tab === "config") {
    v.innerHTML = configView();
    bindConfig();
  } else {
    v.innerHTML = hist();
    $("reset").onclick = function () {
      if (confirm("Apagar tudo?")) {
        S = {
          preco: S.preco,
          precoCaixa: S.precoCaixa,
          tamCaixa: S.tamCaixa,
          estoque: S.estoque,
          vendas: [],
          reservas: [],
        };
        save();
        render();
      }
    };
  }
}
document.querySelectorAll("#nav button").forEach(function (b) {
  b.onclick = function () {
    tab = b.dataset.t;
    render();
  };
});
render();
