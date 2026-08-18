/* BAJUS — Meeting detail: member poll voting */

(function () {
  const MEMBER_ID = "BAJUS-DH-001247";

  const DEFAULT_POLLS_BY_MEETING = {
    "mtg-2026-agm": [
      {
        id: "poll-1",
        question:
          "Do you approve the audited financial statements for FY 2024–25?",
        options: [
          { id: "opt-1a", text: "Approve", votes: 142 },
          { id: "opt-1b", text: "Reject", votes: 8 },
          { id: "opt-1c", text: "Abstain", votes: 12 },
        ],
        status: "closed",
        createdAt: "2026-06-10T09:00:00.000Z",
        allowMultiple: false,
      },
      {
        id: "poll-2",
        question:
          "Should BAJUS adopt mandatory digital hallmarking certification by January 2027?",
        options: [
          { id: "opt-2a", text: "Yes — adopt by Jan 2027", votes: 89 },
          {
            id: "opt-2b",
            text: "Yes — but extend deadline to mid-2027",
            votes: 34,
          },
          {
            id: "opt-2c",
            text: "No — maintain current voluntary system",
            votes: 21,
          },
        ],
        status: "active",
        createdAt: "2026-06-15T10:30:00.000Z",
        allowMultiple: false,
      },
    ],
    "mtg-2026-july-exec": [
      {
        id: "poll-1",
        question:
          "Do you support the proposed reduction of supplementary duty on raw gold imports from 5% to 3%?",
        options: [
          { id: "opt-1a", text: "Yes — approve tariff reduction", votes: 28 },
          { id: "opt-1b", text: "No — maintain current duty rate", votes: 2 },
          { id: "opt-1c", text: "Abstain", votes: 5 },
        ],
        status: "closed",
        createdAt: "2026-07-05T09:45:00.000Z",
        allowMultiple: false,
      },
      {
        id: "poll-2",
        question:
          "Should BAJUS adopt the emergency bullion price stabilization protocol when spot prices move more than 3% in one session?",
        options: [
          { id: "opt-2a", text: "Yes — adopt immediately", votes: 19 },
          { id: "opt-2b", text: "Yes — with a 30-day onboarding period", votes: 8 },
          { id: "opt-2c", text: "No — defer to next executive session", votes: 3 },
        ],
        status: "active",
        createdAt: "2026-07-05T10:15:00.000Z",
        allowMultiple: false,
      },
      {
        id: "poll-3",
        question:
          "Do you support requesting export incentive parity for jewellery exporters in the upcoming national budget?",
        options: [
          { id: "opt-3a", text: "Yes — full parity with RMG sector", votes: 0 },
          { id: "opt-3b", text: "Yes — partial incentives only", votes: 0 },
          { id: "opt-3c", text: "No — not at this time", votes: 0 },
        ],
        status: "disabled",
        createdAt: "2026-07-05T10:30:00.000Z",
        allowMultiple: false,
      },
    ],
  };

  let meetingId = null;
  let pollsStorageKey = "";
  let votesStorageKey = "";
  let polls = [];
  let memberVotes = {};

  function resolveMeetingId() {
    const root = document.getElementById("meeting-detail-root");
    const fromDataset = root?.dataset.meetingId;
    const fromUrl = new URLSearchParams(window.location.search).get("id");
    return fromDataset || fromUrl || null;
  }

  function loadPolls() {
    const defaults = DEFAULT_POLLS_BY_MEETING[meetingId] || [];
    try {
      const stored = localStorage.getItem(pollsStorageKey);
      if (!stored) {
        polls = [...defaults];
        return;
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        polls = [...defaults];
        return;
      }

      const storedById = new Map(parsed.map((poll) => [poll.id, poll]));
      polls = defaults.map((defaultPoll) => {
        const storedPoll = storedById.get(defaultPoll.id);
        if (!storedPoll) return defaultPoll;

        return {
          ...defaultPoll,
          options: defaultPoll.options.map((opt) => {
            const storedOpt = storedPoll.options?.find((o) => o.id === opt.id);
            return storedOpt ? { ...opt, votes: storedOpt.votes } : opt;
          }),
        };
      });
    } catch {
      polls = [...defaults];
    }
  }

  function loadMemberVotes() {
    try {
      const stored = localStorage.getItem(votesStorageKey);
      memberVotes = stored ? JSON.parse(stored) : {};
    } catch {
      memberVotes = {};
    }
  }

  function savePolls() {
    localStorage.setItem(pollsStorageKey, JSON.stringify(polls));
  }

  function saveMemberVotes() {
    localStorage.setItem(votesStorageKey, JSON.stringify(memberVotes));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function totalVotes(poll) {
    return poll.options.reduce((sum, o) => sum + o.votes, 0);
  }

  function memberVoteOptionId(pollId) {
    return memberVotes[pollId] || null;
  }

  function statusBadge(status) {
    const map = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      closed: "bg-zinc-200 text-zinc-500 border-zinc-300",
      disabled: "bg-zinc-100 text-zinc-400 border-zinc-200",
    };
    const labels = {
      active: "Open for Voting",
      closed: "Closed",
      disabled: "Not Yet Open",
    };
    const style = map[status] || map.disabled;
    const label = labels[status] || labels.disabled;
    return `<span class="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style}">${label}</span>`;
  }

  function renderDisabledOptions(poll) {
    return poll.options
      .map(
        (opt) => `
        <div class="poll-vote-option poll-vote-option--disabled flex items-start gap-3 p-3.5 border border-zinc-200 rounded-sm bg-zinc-50 opacity-70">
          <span class="poll-vote-radio-wrap" aria-hidden="true">
            <input type="radio" disabled aria-disabled="true" class="poll-vote-radio" />
          </span>
          <span class="text-sm text-zinc-500 leading-snug pt-0.5">${escapeHtml(opt.text)}</span>
        </div>`,
      )
      .join("");
  }

  function renderResults(poll, highlightOptionId) {
    const total = totalVotes(poll);
    return poll.options
      .map((opt) => {
        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
        const isSelected = highlightOptionId === opt.id;
        return `
          <div class="space-y-1 ${isSelected ? "poll-option-selected" : ""}">
            <div class="flex justify-between text-xs gap-3">
              <span class="text-zinc-700 font-medium flex items-center gap-1.5">
                ${isSelected ? '<i class="ph ph-check-circle text-gold"></i>' : ""}
                ${escapeHtml(opt.text)}
                ${isSelected ? '<span class="text-[9px] text-gold uppercase tracking-wider font-bold">Your vote</span>' : ""}
              </span>
              <span class="text-zinc-400 tabular-nums shrink-0">${opt.votes} · ${pct}%</span>
            </div>
            ${
              isSelected
                ? `<div class="poll-result-track">
              <div class="poll-result-fill poll-result-fill--voted" style="width:${pct}%"></div>
            </div>`
                : `<div class="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div class="h-full bg-zinc-300 rounded-full transition-all duration-500" style="width:${pct}%"></div>
            </div>`
            }
          </div>`;
      })
      .join("");
  }

  function renderVoteForm(poll) {
    const optionsHtml = poll.options
      .map(
        (opt) => `
        <label class="poll-vote-option flex items-start gap-3 p-3.5 border border-zinc-200 rounded-sm cursor-pointer hover:border-gold transition-colors bg-white">
          <span class="poll-vote-radio-wrap" aria-hidden="true">
            <input type="radio" name="poll-${poll.id}" value="${opt.id}" class="poll-vote-radio" required />
          </span>
          <span class="text-sm text-charcoal leading-snug pt-0.5">${escapeHtml(opt.text)}</span>
        </label>`,
      )
      .join("");

    return `
      <form class="poll-vote-form space-y-2" data-poll-id="${poll.id}">
        ${optionsHtml}
        <button type="submit" class="btn-gold mt-4 text-xs w-full sm:w-auto">Submit Vote</button>
      </form>`;
  }

  function renderPollCard(poll) {
    const votedOptionId = memberVoteOptionId(poll.id);
    const hasVoted = Boolean(votedOptionId);
    const total = totalVotes(poll);

    let bodyHtml = "";
    let footerHtml = "";

    if (poll.status === "active" && !hasVoted) {
      bodyHtml = renderVoteForm(poll);
      footerHtml = `<p class="text-[10px] text-zinc-400 mt-4 uppercase tracking-wider"><i class="ph ph-hand-pointing"></i> Select one option and submit your vote</p>`;
    } else if (poll.status === "disabled") {
      bodyHtml = `<div class="space-y-2">${renderDisabledOptions(poll)}</div>`;
      footerHtml = `<p class="text-[10px] text-zinc-400 mt-4 uppercase tracking-wider"><i class="ph ph-lock"></i> Voting will open when the chair enables this poll</p>`;
    } else {
      bodyHtml = `<div class="space-y-3">${renderResults(poll, votedOptionId)}</div>`;
      if (poll.status === "active" && hasVoted) {
        footerHtml = `<p class="text-[10px] text-emerald-700 mt-4 uppercase tracking-wider font-medium"><i class="ph ph-check-circle"></i> Your vote has been recorded · ${total} total vote${total !== 1 ? "s" : ""}</p>`;
      } else if (poll.status === "closed") {
        footerHtml = `<p class="text-[10px] text-zinc-400 mt-4 uppercase tracking-wider"><i class="ph ph-users"></i> Final result · ${total} vote${total !== 1 ? "s" : ""}${hasVoted ? " · You participated" : ""}</p>`;
      }
    }

    return `
      <article class="bg-white border border-zinc-200 rounded-sm p-5 md:p-6 card-shadow${poll.status === "disabled" ? " poll-card--disabled" : ""}" data-poll-id="${poll.id}">
        <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
          <h3 class="font-serif text-base md:text-lg text-charcoal leading-snug flex-1">${escapeHtml(poll.question)}</h3>
          ${statusBadge(poll.status)}
        </div>
        ${bodyHtml}
        ${footerHtml}
      </article>`;
  }

  function visiblePolls() {
    return polls.filter(
      (p) =>
        p.status === "active" ||
        p.status === "closed" ||
        p.status === "disabled",
    );
  }

  function renderPollsList() {
    const container = document.getElementById("polls-list");
    const empty = document.getElementById("polls-empty");
    if (!container) return;

    const visible = visiblePolls();

    if (visible.length === 0) {
      container.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }

    if (empty) empty.classList.add("hidden");
    container.innerHTML = visible.map(renderPollCard).join("");
    bindVoteForms();
  }

  function submitVote(pollId, optionId) {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll || poll.status !== "active" || memberVotes[pollId]) return;

    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return;

    option.votes += 1;
    memberVotes[pollId] = optionId;
    savePolls();
    saveMemberVotes();
    renderPollsList();

    if (window.showToast) {
      window.showToast("Your vote has been submitted successfully.");
    }
  }

  function bindVoteForms() {
    document.querySelectorAll(".poll-vote-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const pollId = form.dataset.pollId;
        const selected = form.querySelector('input[type="radio"]:checked');
        if (!selected) {
          if (window.showToast)
            window.showToast(
              "Please select an option before submitting.",
              "error",
            );
          return;
        }
        submitVote(pollId, selected.value);
      });
    });
  }

  function initTabs() {
    const tabs = document.querySelectorAll(".meeting-tab");
    const panels = document.querySelectorAll(".meeting-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        tabs.forEach((t) =>
          t.classList.toggle("is-active", t.dataset.tab === target),
        );
        panels.forEach((p) =>
          p.classList.toggle("is-active", p.dataset.panel === target),
        );
      });
    });
  }

  function init() {
    if (!document.getElementById("polls-list")) return;

    meetingId = resolveMeetingId();
    if (!meetingId) return;

    pollsStorageKey = `bajus-meeting-polls-${meetingId}`;
    votesStorageKey = `bajus-member-votes-${meetingId}-${MEMBER_ID}`;

    loadPolls();
    loadMemberVotes();
    renderPollsList();
    initTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
