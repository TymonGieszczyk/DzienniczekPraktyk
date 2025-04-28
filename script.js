document.addEventListener("DOMContentLoaded", () => {
    // Elementy DOM
    const views = {
      metryka: document.getElementById("metryczka-view"),
      dziennik: document.getElementById("dziennik-view"),
      podsumowanie: document.getElementById("podsumowanie-view"),
      form: document.getElementById("form-view"),
      summary: document.getElementById("summary-view"),
    }
  
    const tabs = {
      metryka: document.getElementById("tab-metryczka"),
      dziennik: document.getElementById("tab-dziennik"),
      podsumowanie: document.getElementById("tab-podsumowanie"),
    }
  
    const forms = {
      student: document.getElementById("student-form"),
      zajecia: document.getElementById("zajecia-form"),
    }
  
    const elements = {
      summaryName: document.getElementById("summary-name"),
      summaryClass: document.getElementById("summary-class"),
      summaryYear: document.getElementById("summary-year"),
      summaryPlace: document.getElementById("summary-place"),
      summaryStartDate: document.getElementById("summary-start-date"),
      summaryEndDate: document.getElementById("summary-end-date"),
      editBtn: document.getElementById("edit-btn"),
      dzialSelect: document.getElementById("dzial"),
      tematSelect: document.getElementById("temat"),
      wyczyscBtn: document.getElementById("wyczysc-btn"),
      pozostaloGodzin: document.getElementById("pozostalo-godzin"),
      zrealizowaneTematy: document.getElementById("zrealizowane-tematy"),
    }
  
    // Dane aplikacji
    const tematy = {
      "Moduł wstępny": [
        "Czynności wstępne i szkolenia, struktura i organizacja pracy informatyków",
        "Struktura organizacyjna przedsiębiorstwa i elementy przetwarzania informacji",
        "Konfiguracja sprzętu komputerowego i oprogramowania",
      ],
      "Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego": [
        "Montaż sprzętu komputerowego",
        "Naprawa sprzętu komputerowego",
        "Konserwacja i obsługa sprzętu komputerowego",
      ],
      "Systemy informatyczne": [
        "Zasady administrowania systemami informatycznymi i archiwizowania danych",
        "Dokumentacja technologiczna przetwarzania informacji",
        "Biblioteki oprogramowania i zbiorów danych",
        "Zapoznanie z programami do administracji lokalnymi sieciami komputerowymi",
        "Obsługa programów używanych w przedsiębiorstwie",
        "Komputerowe wspomaganie procesów projektowania",
        "Organizacja, zbieranie i kontrola danych, przetwarzanie i wykorzystywanie wyników",
        "Elementy procesów projektowania, programowania i uruchamiania programów komputerowych",
        "Ochrona danych i procesów przetwarzania",
      ],
      "Tworzenie aplikacji internetowych": [
        "Konfiguracja serwerów i przeglądarek pod obsługą aplikacji internetowych",
        "Struktura witryny internetowej - HTML",
        "Stylizacja elementów witryny - CSS",
        "Programowanie aplikacji internetowych - JS, PHP",
        "Testowanie aplikacji internetowych",
      ],
    }
  
    let studentData = {
      imie: "Olga",
      nazwisko: "Nowak",
      klasa: "4i",
      rokSzkolny: "2024/25",
      odbytejW: "Jakaś Firma",
      dataRozpoczecia: "05.05.2025",
      dataZakonczenia: "30.05.2025",
    }
  
    let zajeciaData = []
    let godzinyPozostalo = 140
    let godzinyTematy = {}
  
    // Inicjalizacja godzin tematów
    Object.keys(tematy).forEach((dzial) => {
      tematy[dzial].forEach((temat) => {
        godzinyTematy[temat] = 0
      })
    })
  
    // Funkcje pomocnicze
    const storage = {
      save: () => {
        localStorage.setItem("studentData", JSON.stringify(studentData))
        localStorage.setItem("zajeciaData", JSON.stringify(zajeciaData))
        localStorage.setItem("godzinyPozostalo", godzinyPozostalo)
        localStorage.setItem("godzinyTematy", JSON.stringify(godzinyTematy))
      },
      load: () => {
        const data = {
          student: localStorage.getItem("studentData"),
          zajecia: localStorage.getItem("zajeciaData"),
          godziny: localStorage.getItem("godzinyPozostalo"),
          tematy: localStorage.getItem("godzinyTematy"),
        }
  
        if (data.student) studentData = JSON.parse(data.student)
        if (data.zajecia) zajeciaData = JSON.parse(data.zajecia)
        if (data.godziny) {
          godzinyPozostalo = Number.parseInt(data.godziny)
          elements.pozostaloGodzin.textContent = godzinyPozostalo
        }
        if (data.tematy) {
          godzinyTematy = JSON.parse(data.tematy)
          updateTematyHours()
        }
      },
    }
  
    // Aktualizacja UI
    function updateTematyHours() {
      document.querySelectorAll(".temat-row").forEach((row) => {
        const nazwa = row.querySelector(".temat-nazwa").textContent
        const godzinySpan = row.querySelector(".temat-godziny span")
  
        if (godzinyTematy[nazwa] !== undefined) {
          godzinySpan.textContent = godzinyTematy[nazwa]
  
          if (godzinyTematy[nazwa] > 0) {
            godzinySpan.classList.remove("red-text")
            godzinySpan.classList.add("green-text")
          } else {
            godzinySpan.classList.remove("green-text")
            godzinySpan.classList.add("red-text")
          }
        }
      })
    }
  
    function updateSummary() {
      const moduleHours = {
        "Moduł wstępny": 0,
        "Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego": 0,
        "Systemy informatyczne": 0,
        "Tworzenie aplikacji internetowych": 0,
      }
  
      zajeciaData.forEach((zajecie) => {
        if (zajecie.zrealizowano && moduleHours[zajecie.dzial] !== undefined) {
          moduleHours[zajecie.dzial] += zajecie.godziny
        }
      })
  
      let totalHours = 0
      document.querySelectorAll(".summary-table tbody tr").forEach((row) => {
        const moduleName = row.cells[0].textContent
        const hoursCell = row.cells[1]
  
        if (moduleHours[moduleName] !== undefined) {
          hoursCell.textContent = moduleHours[moduleName]
          totalHours += moduleHours[moduleName]
        }
      })
  
      document.querySelector(".total-hours").textContent = totalHours
  
      const remainingHoursElement = document.querySelector("#podsumowanie-view .remaining-hours .red-text")
      if (remainingHoursElement) remainingHoursElement.textContent = godzinyPozostalo
  
      const proposedGradeElement = document.querySelector(".proposed-grade .green-text")
      if (proposedGradeElement) {
        let grade = "niedostateczny"
        let gradeNumber = 2
  
        const percentCompleted = (totalHours / 140) * 100
  
        if (percentCompleted >= 90) {
          grade = "bardzo dobry"
          gradeNumber = 5
        } else if (percentCompleted >= 75) {
          grade = "dobry"
          gradeNumber = 4
        } else if (percentCompleted >= 50) {
          grade = "dostateczny"
          gradeNumber = 3
        }
  
        proposedGradeElement.textContent = grade
        document.querySelector(".proposed-grade").innerHTML =
          `Proponowana ocena: (${gradeNumber}) <span class="green-text">${grade}</span>`
      }
    }
  
    function clearExistingTopics() {
      if (elements.zrealizowaneTematy) elements.zrealizowaneTematy.innerHTML = ""
    }
  
    // Obsługa zdarzeń
    elements.dzialSelect.addEventListener("change", function () {
      const selectedDzial = this.value
      elements.tematSelect.innerHTML = ""
  
      if (selectedDzial && tematy[selectedDzial]) {
        tematy[selectedDzial].forEach((temat) => {
          const option = document.createElement("option")
          option.value = temat
          option.textContent = temat
          elements.tematSelect.appendChild(option)
        })
      }
    })
  
    elements.wyczyscBtn.addEventListener("click", () => {
      forms.zajecia.reset()
  
      document.getElementById("dataZajec").value = "05.05.2025"
      document.getElementById("dzial").value = "Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego"
  
      elements.tematSelect.innerHTML = ""
      tematy["Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego"].forEach((temat) => {
        const option = document.createElement("option")
        option.value = temat
        option.textContent = temat
        elements.tematSelect.appendChild(option)
      })
      elements.tematSelect.value = "Montaż sprzętu komputerowego"
  
      document.getElementById("sprawozdanie").value = ""
      document.getElementById("zrealizowano").checked = false
      document.getElementById("ileGodzin").value = "5"
      document.getElementById("stopienOpanowania").value = "1"
    })
  
    forms.zajecia.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const data = {
        data: document.getElementById("dataZajec").value,
        dzial: document.getElementById("dzial").value,
        temat: document.getElementById("temat").value,
        opiekun: document.querySelector('input[name="opiekun"]:checked').value,
        sprawozdanie: document.getElementById("sprawozdanie").value,
        zrealizowano: document.getElementById("zrealizowano").checked,
        godziny: Number.parseInt(document.getElementById("ileGodzin").value),
        stopien: document.getElementById("stopienOpanowania").value,
      }
  
      zajeciaData.push(data)
  
      if (data.zrealizowano) {
        godzinyPozostalo -= data.godziny
        if (godzinyPozostalo < 0) godzinyPozostalo = 0
        elements.pozostaloGodzin.textContent = godzinyPozostalo
  
        if (godzinyTematy[data.temat] !== undefined) {
          godzinyTematy[data.temat] += data.godziny
          updateTematyHours()
        }
  
        const div = document.createElement("div")
        div.classList.add("zrealizowany-temat")
        div.innerHTML = `
          <p><span class="label">dział:</span> <span class="value">${data.dzial}</span></p>
          <p><span class="label">temat:</span> <span class="value">${data.temat}</span></p>
          <p><span class="label">opiekun:</span> <span class="value">${data.opiekun}</span>, <span class="label">data realizacji:</span> <span class="value">${data.data}</span>, <span class="label">ilość godzin:</span> <span class="value">${data.godziny}</span>, <span class="label">ocena:</span> <span class="value">${data.stopien}</span></p>
          <p><span class="label">sprawozdanie:</span> <span class="value">${data.sprawozdanie}</span></p>
        `
        elements.zrealizowaneTematy.prepend(div)
      }
  
      storage.save()
      updateSummary()
      alert("Zajęcia zostały dodane!")
    })
  
    forms.student.addEventListener("submit", (e) => {
      e.preventDefault()
  
      studentData = {
        imie: document.getElementById("imie").value,
        nazwisko: document.getElementById("nazwisko").value,
        klasa: document.getElementById("klasa").value,
        rokSzkolny: document.getElementById("rokSzkolny").value,
        odbytejW: document.getElementById("odbytejW").value,
        dataRozpoczecia: document.getElementById("dataRozpoczecia").value,
        dataZakonczenia: document.getElementById("dataZakonczenia").value,
      }
  
      storage.save()
  
      views.form.style.display = "none"
      views.summary.style.display = "block"
  
      elements.summaryName.textContent = `${studentData.imie} ${studentData.nazwisko}`
      elements.summaryClass.textContent = studentData.klasa
      elements.summaryYear.textContent = studentData.rokSzkolny
      elements.summaryPlace.textContent = studentData.odbytejW
      elements.summaryStartDate.textContent = studentData.dataRozpoczecia
      elements.summaryEndDate.textContent = studentData.dataZakonczenia
    })
  
    elements.editBtn.addEventListener("click", () => {
      views.form.style.display = "block"
      views.summary.style.display = "none"
  
      document.getElementById("imie").value = studentData.imie || ""
      document.getElementById("nazwisko").value = studentData.nazwisko || ""
      document.getElementById("klasa").value = studentData.klasa || ""
      document.getElementById("rokSzkolny").value = studentData.rokSzkolny || ""
      document.getElementById("odbytejW").value = studentData.odbytejW || ""
      document.getElementById("dataRozpoczecia").value = studentData.dataRozpoczecia || ""
      document.getElementById("dataZakonczenia").value = studentData.dataZakonczenia || ""
    })
  
    // Obsługa zakładek
    function switchTab(tabName) {
      // Ukryj wszystkie widoki
      Object.values(views).forEach((view) => {
        if (view && view !== views.form && view !== views.summary) {
          view.style.display = "none"
        }
      })
  
      // Usuń klasę active ze wszystkich zakładek
      Object.values(tabs).forEach((tab) => {
        if (tab) tab.classList.remove("active")
      })
  
      // Pokaż wybrany widok i aktywuj zakładkę
      if (views[tabName]) views[tabName].style.display = "block"
      if (tabs[tabName]) tabs[tabName].classList.add("active")
  
      // Dodatkowe akcje dla konkretnych zakładek
      if (tabName === "podsumowanie") {
        updateSummary()
      }
    }
  
    tabs.metryka.addEventListener("click", () => switchTab("metryka"))
    tabs.dziennik.addEventListener("click", () => switchTab("dziennik"))
    tabs.podsumowanie.addEventListener("click", () => switchTab("podsumowanie"))
  
    // Inicjalizacja
    storage.load()
    clearExistingTopics()
    updateTematyHours()
  })
  