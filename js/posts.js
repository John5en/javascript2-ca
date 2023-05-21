// user authentication
const accessToken = localStorage.getItem("accessToken");
if (!accessToken) {
  window.location.href = "index.html";
}

const createPostForm = document.getElementById("createPostForm");
const postContainer = document.getElementById("postContainer");

createPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const post = {
    title,
    body: content,
  };

  const token = localStorage.accessToken;

  fetch("https://api.noroff.dev/api/v1/social/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Created post:", data);

      // fetch and display the posts
      fetchPosts();
    })
    .catch((error) => {
      console.error("Error creating post:", error);
    });
});

// function to update a post
const updatePost = (postId, updatedTitle, updatedContent) => {
  const token = localStorage.accessToken;

  const updatedPost = {
    title: updatedTitle,
    body: updatedContent,
  };

  fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedPost),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      console.log("Post updated successfully");

      // fetch and display the posts
      fetchPosts();
    })
    .catch((error) => {
      console.error("Error updating post:", error);
    });
};
// simple modal
const openUpdateModal = (postId, currentTitle, currentContent) => {
  const updatedTitle = prompt("Enter the updated title:", currentTitle);
  const updatedContent = prompt("Enter the updated content:", currentContent);

  updatePost(postId, updatedTitle, updatedContent);
};

// function to delete  post
function deletePost(postId) {
  const token = localStorage.accessToken;

  fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      console.log("Post deleted successfully");

      fetchPosts();
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
    });
}

// attaching post buttons
const attachButtonListeners = () => {
  const deleteButtons = document.getElementsByClassName("delete-button");
  const updateButtons = document.getElementsByClassName("update-button");

  // delete event listener
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      const postId = deleteButtons[i].parentNode
        .querySelector(".post-id")
        .textContent.replace("Post ID: ", "");
      deletePost(postId);
    });
  }

  // event listener for updating
  for (let i = 0; i < updateButtons.length; i++) {
    updateButtons[i].addEventListener("click", () => {
      const postId = updateButtons[i].parentNode
        .querySelector(".post-id")
        .textContent.replace("Post ID: ", "");
      const currentTitle =
        updateButtons[i].parentNode.querySelector(".post-title").textContent;
      const currentContent =
        updateButtons[i].parentNode.querySelector(".post-body").textContent;
      openUpdateModal(postId, currentTitle, currentContent);
    });
  }
};

// function to fetch and display the posts, and tags
const fetchPosts = (tag) => {
  const token = localStorage.accessToken;

  // construct the API request URL with the tag filter
  let apiUrl = "https://api.noroff.dev/api/v1/social/posts";
  if (tag) {
    apiUrl += `?_tag=${tag}`;
  }

  fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to retrieve posts");
      }
      return response.json();
    })
    .then((data) => {
      console.log("All posts:", data);

      postContainer.innerHTML = "";

      // creating html for postContainer
      data.forEach((post) => {
        const postHtml = `
            <div class="post-card">
              <div class="card-content">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
                <p class="post-id">Post ID: ${post.id}</p>
                <button class="btn btn-danger delete-button">Delete</button>
                <button class="btn btn-primary update-button">Update</button>
              </div>
            </div>
          `;

        postContainer.innerHTML += postHtml;
      });
      attachButtonListeners();
    })
    .catch((error) => {
      console.error("Error retrieving posts:", error);
    });
};

fetchPosts();

const searchInput = document.getElementById("searchInput");

const postCards = document.getElementsByClassName("post-card");

// function to perform the search
const searchPosts = () => {
  const searchTerm = searchInput.value.toLowerCase();

  // loop through all post cards
  Array.from(postCards).forEach((card) => {
    const postTitle = card
      .querySelector(".post-title")
      .textContent.toLowerCase();
    const postBody = card.querySelector(".post-body").textContent.toLowerCase();

    // checks if search matches
    if (postTitle.includes(searchTerm) || postBody.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// add event listener for search input
searchInput.addEventListener("input", searchPosts);

// get filter form and elements
const filterForm = document.getElementById("filterForm");
const tagInput = document.getElementById("tagInput");

// function to handle filter button click event
const handleFilterButtonClick = () => {
  const tag = tagInput.value.toLowerCase();

  fetchPosts(tag);
};

// add event listener for filter button click
document
  .getElementById("filterButton")
  .addEventListener("click", handleFilterButtonClick);
