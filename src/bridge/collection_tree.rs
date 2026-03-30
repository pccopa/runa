use serde::Serialize;

use crate::models::files::{NodeType, Tree};

/// Vista del árbol de colección para la UI (índices explícitos, serializable vía Tauri/JSON).
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CollectionTreeDto {
    pub root_path: String,
    pub nodes: Vec<CollectionNodeDto>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CollectionNodeDto {
    pub index: usize,
    pub parent: Option<usize>,
    pub children: Vec<usize>,
    pub node_type: &'static str,
    pub filename: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<i16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub method: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub relative_path: Option<String>,
}

fn directory_label(tree: &Tree, node_filename: &str) -> String {
    if !node_filename.is_empty() {
        return node_filename.to_string();
    }
    tree.root_path()
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or("Proyecto")
        .to_string()
}

impl From<&Tree> for CollectionTreeDto {
    fn from(tree: &Tree) -> Self {
        let nodes = tree
            .nodes()
            .iter()
            .enumerate()
            .map(|(idx, node)| {
                let node_type = match node.node_type() {
                    NodeType::Directory => "directory",
                    NodeType::File => "file",
                };
                let filename = match node.node_type() {
                    NodeType::Directory => directory_label(tree, node.filename()),
                    NodeType::File => node.filename().to_string(),
                };
                let (display_name, order, method) = match node.metadata() {
                    Some(m) => (
                        Some(m.runa().to_string()),
                        Some(m.display_order()),
                        Some(m.method().as_str().to_string()),
                    ),
                    None => (None, None, None),
                };
                let relative_path = match node.node_type() {
                    NodeType::File => tree.node_relative_path(idx),
                    NodeType::Directory => None,
                };
                CollectionNodeDto {
                    index: idx,
                    parent: node.parent(),
                    children: node.children().to_vec(),
                    node_type,
                    filename,
                    display_name,
                    order,
                    method,
                    relative_path,
                }
            })
            .collect();
        Self {
            root_path: tree.root_path().display().to_string(),
            nodes,
        }
    }
}
