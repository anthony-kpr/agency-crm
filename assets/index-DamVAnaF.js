(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`Adana.Adıyaman.Afyonkarahisar.Ağrı.Amasya.Ankara.Antalya.Artvin.Aydın.Balıkesir.Bilecik.Bingöl.Bitlis.Bolu.Burdur.Bursa.Çanakkale.Çankırı.Çorum.Denizli.Diyarbakır.Edirne.Elazığ.Erzincan.Erzurum.Eskişehir.Gaziantep.Giresun.Gümüşhane.Hakkari.Hatay.Isparta.Mersin.İstanbul.İzmir.Kars.Kastamonu.Kayseri.Kırklareli.Kırşehir.Kocaeli.Konya.Kütahya.Malatya.Manisa.Kahramanmaraş.Mardin.Muğla.Muş.Nevşehir.Niğde.Ordu.Rize.Sakarya.Samsun.Siirt.Sinop.Sivas.Tekirdağ.Tokat.Trabzon.Tunceli.Şanlıurfa.Uşak.Van.Yozgat.Zonguldak.Aksaray.Bayburt.Karaman.Kırıkkale.Batman.Şırnak.Bartın.Ardahan.Iğdır.Yalova.Karabük.Kilis.Osmaniye.Düzce.Yurt Dışı.Belirtilmedi`.split(`.`),t=[`Kadın`,`Erkek`,`Non-binary`,`Belirtmek istemiyor`,`Diğer`,`Belirtilmedi`],n=[`Siyah`,`Koyu Kahverengi`,`Kahverengi`,`Açık Kahverengi`,`Kumral`,`Koyu Kumral`,`Açık Kumral`,`Sarı`,`Koyu Sarı`,`Platin Sarı`,`Kızıl`,`Bakır`,`Auburn / Kızıl Kahve`,`Gri`,`Beyaz`,`Boyalı`,`Renkli / Fantastik`,`Kel`,`Belirtilmedi`],r=[`Kahverengi`,`Koyu Kahverengi`,`Açık Kahverengi`,`Ela`,`Yeşil`,`Mavi`,`Gri`,`Bal Rengi`,`Siyah`,`Kehribar`,`Farklı Renkli`,`Lens Kullanıyor`,`Belirtilmedi`],i=[`Model`,`Oyuncu`,`Figüran`,`Host`,`Hostes`,`Promotör`,`Dansçı`,`Influencer`,`Reklam Yüzü`,`Seslendirme`,`Çocuk Oyuncu`,`Sporcu`,`Müzisyen`,`Diğer`,`Belirtilmedi`],a=[{key:`adSoyad`,label:`Ad Soyad`,type:`text`,required:!0,placeholder:`Örn. Ayşe Yılmaz`},{key:`cinsiyet`,label:`Cinsiyet`,type:`select`,options:t},{key:`yas`,label:`Yaş`,type:`number`,min:0,max:120},{key:`sehir`,label:`Şehir`,type:`select`,options:e},{key:`boyCm`,label:`Boy (cm)`,type:`number`,min:0,max:260},{key:`kiloKg`,label:`Kilo (kg)`,type:`number`,min:0,max:300},{key:`sacRengi`,label:`Saç Rengi`,type:`select`,options:n},{key:`gozRengi`,label:`Göz Rengi`,type:`select`,options:r},{key:`tur`,label:`Tür`,type:`select`,options:i},{key:`tcNo`,label:`TC No`,type:`text`,placeholder:`İsteğe bağlı`},{key:`telefonNo`,label:`Telefon No`,type:`tel`,placeholder:`İsteğe bağlı`},{key:`adayNo`,label:`Aday No`,type:`text`,placeholder:`İsteğe bağlı`},{key:`kartNo`,label:`Kart No`,type:`text`,placeholder:`İsteğe bağlı`},{key:`notlar`,label:`Notlar`,type:`textarea`,placeholder:`Ek notlar`}],o=[{key:`id`,label:`ID`},{key:`createdAt`,label:`Oluşturulma Tarihi`},{key:`updatedAt`,label:`Güncellenme Tarihi`}],s=[...o,...a.map(({key:e,label:t})=>({key:e,label:t}))],c=[`adSoyad`,`cinsiyet`,`yas`,`sehir`,`boyCm`,`kiloKg`,`sacRengi`,`gozRengi`,`tur`,`telefonNo`];function l(e){return a.find(t=>t.key===e)||o.find(t=>t.key===e)}function u(e){return l(e)?.label||e}var ee=`aday-takip-sistemi-db`,d=1,f=`candidates`;function p(){return new Promise((e,t)=>{let n=indexedDB.open(ee,d);n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(f)||e.createObjectStore(f,{keyPath:`id`}).createIndex(`updatedAt`,`updatedAt`,{unique:!1})},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}function m(e,t=`readonly`){return e.transaction(f,t).objectStore(f)}function h(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error)})}async function g(){let e=await p(),t=await h(m(e).getAll());return e.close(),t.sort((e,t)=>String(t.updatedAt||``).localeCompare(String(e.updatedAt||``)))}async function _(e){let t=await p();await h(m(t,`readwrite`).put(e)),t.close()}async function v(e){let t=await p();await new Promise((n,r)=>{let i=t.transaction(f,`readwrite`),a=i.objectStore(f);e.forEach(e=>a.put(e)),i.oncomplete=()=>n(),i.onerror=()=>r(i.error)}),t.close()}async function y(e){let t=await p();await h(m(t,`readwrite`).delete(e)),t.close()}async function b(e){let t=await p();await new Promise((n,r)=>{let i=t.transaction(f,`readwrite`),a=i.objectStore(f);a.clear(),e.forEach(e=>a.put(e)),i.oncomplete=()=>n(),i.onerror=()=>r(i.error)}),t.close()}var x=new Map;for(let e of s)x.set(S(e.key),e.key),x.set(S(e.label),e.key);x.set(S(`Name / Surname`),`adSoyad`),x.set(S(`Name`),`adSoyad`),x.set(S(`Gender`),`cinsiyet`),x.set(S(`Age`),`yas`),x.set(S(`City`),`sehir`),x.set(S(`Height`),`boyCm`),x.set(S(`Height Cm`),`boyCm`),x.set(S(`Weight`),`kiloKg`),x.set(S(`Weight Kg`),`kiloKg`),x.set(S(`Hair Color`),`sacRengi`),x.set(S(`Eye Color`),`gozRengi`),x.set(S(`Type`),`tur`),x.set(S(`Phone`),`telefonNo`),x.set(S(`Phone No`),`telefonNo`),x.set(S(`Candidate ID`),`adayNo`),x.set(S(`Candidate Card No`),`kartNo`),x.set(S(`Notes`),`notlar`);function S(e){return String(e||``).trim().toLocaleLowerCase(`tr-TR`).replace(/ı/g,`i`).replace(/ğ/g,`g`).replace(/ü/g,`u`).replace(/ş/g,`s`).replace(/ö/g,`o`).replace(/ç/g,`c`).replace(/[^a-z0-9]+/g,``)}function C(e){let t=e==null?``:String(e);return/[",\n\r;]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t}function te(e){let t=s.map(e=>e.label),n=e.map(e=>s.map(t=>C(e[t.key]??``)).join(`,`));return`﻿`+[t.map(C).join(`,`),...n].join(`
`)}function ne(e){let t=te(e),n=new Date().toISOString().slice(0,16).replace(`T`,`-`).replace(`:`,`-`),r=new Blob([t],{type:`text/csv;charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=`aday-takip-${n}.csv`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(i)}function w(e){let t=(e.match(/,/g)||[]).length;return(e.match(/;/g)||[]).length>t?`;`:`,`}function T(e){let t=e.replace(/^\ufeff/,``),n=w(t.split(/\r?\n/)[0]||``),r=[],i=[],a=``,o=!1;for(let e=0;e<t.length;e+=1){let s=t[e],c=t[e+1];if(s===`"`){o&&c===`"`?(a+=`"`,e+=1):o=!o;continue}if(s===n&&!o){i.push(a),a=``;continue}if((s===`
`||s===`\r`)&&!o){s===`\r`&&c===`
`&&(e+=1),i.push(a),i.some(e=>e.trim()!==``)&&r.push(i),i=[],a=``;continue}a+=s}return(a.length||i.length)&&(i.push(a),i.some(e=>e.trim()!==``)&&r.push(i)),r}function E(e){let t=T(e);if(t.length<2)return[];let n=t[0].map(e=>x.get(S(e))||null),r=new Date().toISOString();return t.slice(1).map(e=>{let t={};n.forEach((n,r)=>{n&&(t[n]=e[r]==null?``:String(e[r]).trim())});for(let e of a)if(e.type===`number`&&t[e.key]!==``&&t[e.key]!=null){let n=Number(String(t[e.key]).replace(`,`,`.`));t[e.key]=Number.isFinite(n)?n:``}return{id:t.id||crypto.randomUUID(),createdAt:t.createdAt||r,updatedAt:t.updatedAt||r,...t}})}var D=document.querySelector(`#app`),O=`aday-takip-settings-v1`,k={search:``,cinsiyet:``,sehir:``,sacRengi:``,gozRengi:``,tur:``,yasMin:``,yasMax:``,boyMin:``,boyMax:``,kiloMin:``,kiloMax:``},A={candidates:[],filters:{...k},visibleColumns:[...c],sort:{key:`updatedAt`,direction:`desc`},editingId:null,isFormOpen:!1,isFilterPanelOpen:!1,isColumnPanelOpen:!1,importMode:`merge`,lastSavedMessage:``};function re(){try{let e=localStorage.getItem(O);if(!e)return;let t=JSON.parse(e);Array.isArray(t.visibleColumns)&&(A.visibleColumns=t.visibleColumns),t.sort?.key&&(A.sort=t.sort)}catch(e){console.warn(`Ayarlar okunamadı:`,e)}}function j(){localStorage.setItem(O,JSON.stringify({visibleColumns:A.visibleColumns,sort:A.sort}))}function M(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function N(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?String(e):new Intl.DateTimeFormat(`tr-TR`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}).format(t)}function P(e,t){let n=e[t];return n==null||n===``?`-`:t===`createdAt`||t===`updatedAt`?N(n):n}function F(e){return String(e??``).toLocaleLowerCase(`tr-TR`).replace(/ı/g,`i`).replace(/ğ/g,`g`).replace(/ü/g,`u`).replace(/ş/g,`s`).replace(/ö/g,`o`).replace(/ç/g,`c`)}function I(){let e=A.filters,t=F(e.search).split(/\s+/).filter(Boolean);return A.candidates.filter(n=>{if(e.cinsiyet&&n.cinsiyet!==e.cinsiyet||e.sehir&&n.sehir!==e.sehir||e.sacRengi&&n.sacRengi!==e.sacRengi||e.gozRengi&&n.gozRengi!==e.gozRengi||e.tur&&n.tur!==e.tur||!L(n.yas,e.yasMin,e.yasMax)||!L(n.boyCm,e.boyMin,e.boyMax)||!L(n.kiloKg,e.kiloMin,e.kiloMax))return!1;if(t.length>0){let e=F(a.map(e=>n[e.key]).join(` `));if(!t.every(t=>e.includes(t)))return!1}return!0})}function L(e,t,n){let r=Number(e);return(t===``||t==null)&&(n===``||n==null)?!0:!(!Number.isFinite(r)||t!==``&&t!=null&&r<Number(t)||n!==``&&n!=null&&r>Number(n))}function R(e){let{key:t,direction:n}=A.sort,r=n===`asc`?1:-1;return[...e].sort((e,n)=>{let i=e[t],a=n[t],o=Number(i),s=Number(a);return Number.isFinite(o)&&Number.isFinite(s)?(o-s)*r:String(i??``).localeCompare(String(a??``),`tr-TR`,{numeric:!0,sensitivity:`base`})*r})}function z(){return R(I())}function B(e){return a.find(t=>t.key===e)}function V(a){return a===`cinsiyet`?t:a===`sehir`?e:a===`sacRengi`?n:a===`gozRengi`?r:a===`tur`?i:[]}function H(e,t=``,n=!1,r=`Seçiniz`){let i=[...e];return t&&!i.includes(t)&&i.unshift(t),(n?`<option value="">${M(r)}</option>`:``)+i.map(n=>{let r=e.includes(n)?n:`${n} (CSV'den gelen)`;return`<option value="${M(n)}" ${n===t?`selected`:``}>${M(r)}</option>`}).join(``)}function U(){let a=z();D.innerHTML=`
    <div class="app-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Offline PWA</p>
          <h1>Aday Takip Sistemi</h1>
          <p class="hero-text">Adayları ekle, filtrele, CSV olarak dışa aktar ve başka cihazda içe aktar. Tüm veri cihazda lokal tutulur.</p>
        </div>
        <div class="hero-actions">
          <button class="primary" data-action="open-form">+ Aday Ekle</button>
          <button data-action="export-csv">CSV Dışa Aktar</button>
          <label class="file-button">
            CSV İçe Aktar
            <input type="file" accept=".csv,text/csv" data-action="import-csv" />
          </label>
        </div>
      </header>

      <section class="status-row">
        <div class="stat"><strong>${A.candidates.length}</strong><span>Toplam aday</span></div>
        <div class="stat"><strong>${a.length}</strong><span>Görünen sonuç</span></div>
        <div class="stat wide"><strong>${A.lastSavedMessage||`Hazır`}</strong><span>Durum</span></div>
      </section>

      <section class="panel controls-panel">
        <div class="control-actions">
          <button data-action="toggle-filters">${A.isFilterPanelOpen?`Filtreleri Gizle`:`Filtreleri Aç`}</button>
          <button data-action="clear-filters">Filtreleri Temizle</button>
          <button data-action="toggle-columns">Sütunları Düzenle</button>
          <label class="inline-check">
            <span>İçe aktarma modu</span>
            <select data-action="import-mode">
              <option value="merge" ${A.importMode===`merge`?`selected`:``}>Birleştir / güncelle</option>
              <option value="replace" ${A.importMode===`replace`?`selected`:``}>Tüm veriyi değiştir</option>
            </select>
          </label>
        </div>
        ${A.isFilterPanelOpen?`
          <div class="control-grid collapsible-filters">
            <label class="field full">
              <span>Genel Arama</span>
              <input type="search" value="${M(A.filters.search)}" data-filter="search" placeholder="Ad, şehir, telefon, not vb. ara" />
            </label>
            ${W(`cinsiyet`,`Cinsiyet`,t)}
            ${W(`sehir`,`Şehir`,e)}
            ${W(`sacRengi`,`Saç Rengi`,n)}
            ${W(`gozRengi`,`Göz Rengi`,r)}
            ${W(`tur`,`Tür`,i)}
            ${G(`yas`,`Yaş`)}
            ${G(`boy`,`Boy`)}
            ${G(`kilo`,`Kilo`)}
          </div>
        `:``}
        ${A.isColumnPanelOpen?K():``}
      </section>

      <section class="panel list-panel">
        <div class="table-wrap">
          ${ie(a)}
        </div>
        <div class="card-list">
          ${a.map(q).join(``)||J()}
        </div>
      </section>

      ${A.isFormOpen?Y():``}
    </div>
  `}function W(e,t,n){return`
    <label class="field">
      <span>${M(t)}</span>
      <select data-filter="${e}">
        ${H(n,A.filters[e],!0,`Tümü`)}
      </select>
    </label>
  `}function G(e,t){let n=`${e}Min`,r=`${e}Max`;return`
    <div class="range-pair">
      <label class="field">
        <span>${M(t)} Min</span>
        <input type="number" value="${M(A.filters[n])}" data-filter="${n}" />
      </label>
      <label class="field">
        <span>${M(t)} Max</span>
        <input type="number" value="${M(A.filters[r])}" data-filter="${r}" />
      </label>
    </div>
  `}function K(){return`
    <div class="column-panel">
      <div class="column-panel-header">
        <strong>Görünen Sütunlar</strong>
        <span>Tablodaki alanları aç/kapat. Mobil kartlarda temel bilgiler yine görünür.</span>
      </div>
      <div class="column-list">
        ${a.map(e=>`
          <label class="column-check">
            <input type="checkbox" data-column="${e.key}" ${A.visibleColumns.includes(e.key)?`checked`:``} />
            <span>${M(e.label)}</span>
          </label>
        `).join(``)}
      </div>
    </div>
  `}function ie(e){if(e.length===0)return J();let t=A.visibleColumns.filter(e=>B(e));return`
    <table>
      <thead>
        <tr>
          ${t.map(e=>`
            <th>
              <button class="sort-button" data-sort="${e}">
                ${M(u(e))}
                ${A.sort.key===e?A.sort.direction===`asc`?`↑`:`↓`:``}
              </button>
            </th>
          `).join(``)}
          <th class="actions-col">İşlem</th>
        </tr>
      </thead>
      <tbody>
        ${e.map(e=>`
          <tr>
            ${t.map(t=>`<td>${M(P(e,t))}</td>`).join(``)}
            <td class="actions-cell">
              <button data-action="edit" data-id="${e.id}">Düzenle</button>
              <button class="danger" data-action="delete" data-id="${e.id}">Sil</button>
            </td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
  `}function q(e){return`
    <article class="candidate-card">
      <div class="card-header">
        <div>
          <h3>${M(e.adSoyad||`İsimsiz Aday`)}</h3>
          <p>${M([e.cinsiyet,e.yas?`${e.yas} yaş`:``,e.sehir].filter(Boolean).join(` · `)||`Bilgi yok`)}</p>
        </div>
        <div class="card-actions">
          <button data-action="edit" data-id="${e.id}">Düzenle</button>
          <button class="danger" data-action="delete" data-id="${e.id}">Sil</button>
        </div>
      </div>
      <dl>
        <div><dt>Boy</dt><dd>${M(P(e,`boyCm`))}</dd></div>
        <div><dt>Kilo</dt><dd>${M(P(e,`kiloKg`))}</dd></div>
        <div><dt>Saç</dt><dd>${M(P(e,`sacRengi`))}</dd></div>
        <div><dt>Göz</dt><dd>${M(P(e,`gozRengi`))}</dd></div>
        <div><dt>Tür</dt><dd>${M(P(e,`tur`))}</dd></div>
        <div><dt>Telefon</dt><dd>${M(P(e,`telefonNo`))}</dd></div>
      </dl>
      ${e.notlar?`<p class="notes">${M(e.notlar)}</p>`:``}
    </article>
  `}function J(){return`
    <div class="empty-state">
      <strong>Kayıt bulunamadı.</strong>
      <p>Filtreleri temizleyebilir veya yeni aday ekleyebilirsin.</p>
    </div>
  `}function Y(){let e=A.candidates.find(e=>e.id===A.editingId),t=e?`Adayı Düzenle`:`Yeni Aday Ekle`,n=e||{};return`
    <div class="modal-backdrop" data-action="close-form">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" data-modal>
        <div class="modal-header">
          <h2 id="form-title">${t}</h2>
          <button class="icon-button" data-action="close-form" aria-label="Kapat">×</button>
        </div>
        <form id="candidate-form" class="candidate-form">
          <div class="form-grid">
            ${a.map(e=>ae(e,n[e.key])).join(``)}
          </div>
          <div class="form-actions">
            <button type="button" data-action="close-form">Vazgeç</button>
            <button type="submit" class="primary">Kaydet</button>
          </div>
        </form>
      </section>
    </div>
  `}function ae(e,t=``){let n=`name="${e.key}" id="field-${e.key}" ${e.required?`required`:``}`,r=`<span>${M(e.label)}${e.required?` *`:``}</span>`;return e.type===`select`?`
      <label class="field">
        ${r}
        <select ${n}>
          ${H(V(e.key),t,!0,`Seçiniz`)}
        </select>
      </label>
    `:e.type===`textarea`?`
      <label class="field full">
        ${r}
        <textarea ${n} placeholder="${M(e.placeholder||``)}">${M(t)}</textarea>
      </label>
    `:`
    <label class="field">
      ${r}
      <input ${n} type="${e.type||`text`}" value="${M(t)}" placeholder="${M(e.placeholder||``)}" ${e.min==null?``:`min="${e.min}"`} ${e.max==null?``:`max="${e.max}"`} />
    </label>
  `}async function X(){A.candidates=await g(),U()}function Z(e){A.lastSavedMessage=e}async function oe(e){e.preventDefault();let t=new FormData(e.target),n=new Date().toISOString(),r=A.candidates.find(e=>e.id===A.editingId),i={id:r?.id||crypto.randomUUID(),createdAt:r?.createdAt||n,updatedAt:n};for(let e of a){let n=t.get(e.key);e.type===`number`?i[e.key]=n===``||n==null?``:Number(n):i[e.key]=String(n??``).trim()}await _(i),A.isFormOpen=!1,A.editingId=null,Z(`Kaydedildi`),await X()}function Q(e=null){A.editingId=e,A.isFormOpen=!0,U(),setTimeout(()=>document.querySelector(`#field-adSoyad`)?.focus(),0)}function se(){A.isFormOpen=!1,A.editingId=null,U()}async function $(e){let t=A.candidates.find(t=>t.id===e)?.adSoyad||`bu aday`;confirm(`${t} silinsin mi? Bu işlem geri alınamaz.`)&&(await y(e),Z(`Silindi`),await X())}function ce(e){A.sort.key===e?A.sort.direction=A.sort.direction===`asc`?`desc`:`asc`:A.sort={key:e,direction:`asc`},j(),U()}async function le(e){if(!e)return;let t=E(await e.text());if(t.length===0){alert(`CSV içinde aktarılacak aday bulunamadı.`);return}if(A.importMode===`replace`){if(!confirm(`${t.length} aday içe aktarılacak ve mevcut tüm lokal veri değiştirilecek. Emin misin?`))return;await b(t),Z(`${t.length} aday içe aktarıldı`),await X();return}let n=new Map(A.candidates.map(e=>[e.id,e]));await v(t.map(e=>{let t=n.get(e.id);return t?Date.parse(e.updatedAt||``)>=Date.parse(t.updatedAt||``)?{...t,...e}:t:e})),Z(`${t.length} aday birleştirildi`),await X()}function ue(){A.filters={...k},U()}function de(e,t){t&&!A.visibleColumns.includes(e)&&A.visibleColumns.push(e),t||(A.visibleColumns=A.visibleColumns.filter(t=>t!==e)),A.visibleColumns.length===0&&(A.visibleColumns=[`adSoyad`]),j(),U()}function fe(){D.addEventListener(`click`,async e=>{let t=e.target,n=t.closest(`[data-action]`),r=t.closest(`[data-sort]`);if(r){ce(r.dataset.sort);return}if(!n)return;let i=n.dataset.action,a=n.dataset.id;if(i===`open-form`&&Q(),i===`close-form`){if(t.closest(`[data-modal]`)&&t.dataset.action!==`close-form`)return;se()}i===`edit`&&Q(a),i===`delete`&&await $(a),i===`export-csv`&&ne(z()),i===`clear-filters`&&ue(),i===`toggle-filters`&&(A.isFilterPanelOpen=!A.isFilterPanelOpen,U()),i===`toggle-columns`&&(A.isColumnPanelOpen=!A.isColumnPanelOpen,U())}),D.addEventListener(`input`,e=>{let t=e.target;t.matches(`[data-filter]`)&&(A.filters[t.dataset.filter]=t.value,U())}),D.addEventListener(`change`,async e=>{let t=e.target;t.matches(`[data-filter]`)&&(A.filters[t.dataset.filter]=t.value,U()),t.matches(`[data-column]`)&&de(t.dataset.column,t.checked),t.matches(`[data-action="import-mode"]`)&&(A.importMode=t.value),t.matches(`[data-action="import-csv"]`)&&(await le(t.files?.[0]),t.value=``)}),D.addEventListener(`submit`,async e=>{e.target.matches(`#candidate-form`)&&await oe(e)})}function pe(){`serviceWorker`in navigator&&window.location.protocol!==`file:`&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`./sw.js`).catch(e=>{console.warn(`Service worker kaydı başarısız:`,e)})})}async function me(){re(),fe(),pe(),await X()}me().catch(e=>{console.error(e),D.innerHTML=`
    <main class="fatal-error">
      <h1>Uygulama başlatılamadı</h1>
      <p>${M(e.message||e)}</p>
    </main>
  `});