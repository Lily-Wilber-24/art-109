// Cache the controls and containers used by filtering and thread creation.
const categoryButtons = document.querySelectorAll(".category-button");
const searchInput = document.querySelector("#thread-search");
const threadList = document.querySelector("#threads");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const threadForm = document.querySelector("#thread-form");
const feedback = document.querySelector("#form-feedback");

let activeCategory = "all";

// Apply the selected category and search query together, then update the result state.
function filterThreads() {
    const query = searchInput.value.trim().toLowerCase();
    const cards = threadList.querySelectorAll(".thread-card");
    let visibleCount = 0;

    cards.forEach((card) => {
        const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
        const matchesSearch = card.dataset.title.toLowerCase().includes(query);
        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    resultCount.textContent = visibleCount;
    emptyState.hidden = visibleCount !== 0;
}

// Keep the selected category in sync with the filter buttons.
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        categoryButtons.forEach((item) => item.classList.toggle("selected", item === button));
        filterThreads();
    });
});

searchInput.addEventListener("input", filterThreads);

// "/" focuses search, while Escape clears it and returns focus to the page.
document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        searchInput.focus();
    }

    if (event.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        filterThreads();
        searchInput.blur();
    }
});

// Display labels used for category tags on newly created threads.
const categoryNames = {
    help: "NEED A HINT?",
    lore: "LORE & THEORIES",
    collection: "THE COLLECTION",
    "off-topic": "THE PUB",
};

// Create a thread card from the form values and add it to the top of the board.
threadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(threadForm);
    const title = formData.get("title").trim();
    const category = formData.get("category");

    if (!title) return;

    const card = document.createElement("article");
    card.className = "thread-card";
    card.dataset.category = category;
    card.dataset.title = title.toLowerCase();

    // Build the card with DOM nodes so user-provided text is inserted as text.
    const vote = document.createElement("div");
    vote.className = "thread-vote";
    vote.setAttribute("aria-label", "0 votes");
    vote.innerHTML = "<span aria-hidden=\"true\">▲</span><b>0</b>";

    const main = document.createElement("div");
    main.className = "thread-main";

    const meta = document.createElement("div");
    meta.className = "thread-meta";
    const tag = document.createElement("span");
    tag.className = `tag tag-${category}`;
    tag.textContent = categoryNames[category];
    const author = document.createElement("span");
    author.textContent = "STARTED BY ";
    const authorName = document.createElement("b");
    authorName.textContent = "you";
    author.append(authorName);
    meta.append(tag, author);

    const heading = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = "#new-transmission";
    titleLink.textContent = title;
    heading.append(titleLink);

    const excerpt = document.createElement("p");
    excerpt.className = "thread-excerpt";
    excerpt.textContent = "A fresh transmission from the community. Add a reply and keep the adventure going.";

    const footer = document.createElement("div");
    footer.className = "thread-footer";
    footer.innerHTML = "<span>◷ &nbsp;JUST NOW</span><span>◉ &nbsp;1 VIEW</span>";
    main.append(meta, heading, excerpt, footer);

    const replies = document.createElement("div");
    replies.className = "thread-replies";
    replies.innerHTML = "<b>00</b><span>REPLIES</span>";

    const lastReply = document.createElement("div");
    lastReply.className = "last-reply";
    const avatar = document.createElement("span");
    avatar.className = "reply-avatar";
    avatar.textContent = "YOU";
    const authorInfo = document.createElement("span");
    const name = document.createElement("b");
    name.textContent = "you";
    const time = document.createElement("small");
    time.textContent = "JUST NOW";
    authorInfo.append(name, time);
    lastReply.append(avatar, authorInfo);

    card.append(vote, main, replies, lastReply);
    threadList.insertBefore(card, threadList.firstChild);

    // Reset the controls and show the new post in the unfiltered thread list.
    threadForm.reset();
    activeCategory = "all";
    categoryButtons.forEach((button) => button.classList.toggle("selected", button.dataset.category === "all"));
    searchInput.value = "";
    feedback.textContent = "TRANSMISSION RECEIVED. YOUR THREAD IS ON THE BOARD.";
    filterThreads();
    card.scrollIntoView({ behavior: "smooth", block: "center" });
});
